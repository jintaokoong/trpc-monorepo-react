import { ActionIcon, Button, Group, Menu, Modal, Stack, Text, TextInput, Title } from '@mantine/core';
import { FormEventHandler, KeyboardEventHandler, useCallback, useEffect, useState } from "react";
import { GoGrabber, GoPencil, GoTrashcan } from 'react-icons/go';
import { useQueryClient } from 'react-query';
import type { Post } from '../../../server/src/types/database';
import { trpc } from "../App";

const UpdatePostModal = ({ post, onClose }: { post: Post | null, onClose: () => void }) => {
  const [content, setContent] = useState('');
  const qc = useQueryClient();
  const { mutate: update, isLoading, error } = trpc.useMutation(['updatePost']);
  useEffect(() => {
    setContent(post?.content ?? '');
    return () => {
      setContent('');
    }
  }, [post?.content])

  const updateHandler: FormEventHandler<HTMLFormElement> = useCallback((event) => {
    event.preventDefault();
    if (!post?.id) return;
    update({ id: post.id, content, }, {
      onSuccess: (data) => {
        qc.setQueryData<Post[] | undefined>(['posts'], (prev) => {
          if (!prev) return prev;
          // replace the post with the updated one keep order
          const index = prev.findIndex(p => p.id === post.id);
          if (index === -1) return prev;
          const newPosts = [...prev];
          newPosts[index] = data;
          return newPosts;
        })
        onClose();
      },
      onSettled: () => {
        return qc.invalidateQueries(['posts']);
      }
    })
  }, [update, onClose, content])

  return (
    <Modal title={'Update Post'} opened={Boolean(post)} onClose={onClose}>
        <form onSubmit={updateHandler}>
        <Stack>
          <TextInput error={error?.message} value={content} onChange={(e) => setContent(e.currentTarget.value)} />
          <Button type={'submit'} loading={isLoading}>Submit</Button>
          </Stack>
        </form>
    </Modal>
  )
}

const Posts = () => {
  const [content, setContent] = useState('');
  
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = trpc.useQuery(['posts']);
  const { mutate: createMutation, error: e } = trpc.useMutation(['createPost']);
  const { mutate: deleteMutation } = trpc.useMutation(['deletePost']);
  const [updateItem, setUpdateItem] = useState<Post | null>(null);
  
  const createPost: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== "Enter") {
      return;
    }
    setContent('');
    createMutation({
      content: content,
    }, {
      onSuccess: (data) => {
        queryClient.setQueryData<Post[] | undefined>(['posts'], (prev) => {
          if (!prev) return prev;
          return [...prev, data];
        })
      },
      onSettled: () => {
        return queryClient.invalidateQueries(['posts']);
      }
    })
  }
  
  const deleteHandler = useCallback((id: string) => {
    return () => deleteMutation(id, {
      onSuccess: () => {
        queryClient.setQueryData<Post[] | undefined>(['posts'], (prev) => {
          if (!prev) return prev;
          return prev.filter(p => p.id !== id);
        })
      },
      onSettled: () => {
        return queryClient.invalidateQueries(['posts']);
      }
    })
  }, [deleteMutation, queryClient])

  return <Stack>
    <Title order={4}>Create New Post</Title>
    <TextInput error={e?.message} sx={{ width: '100%' }} value={content} onChange={(e) => setContent(e.currentTarget.value)} onKeyUp={createPost} />
    <Title order={4}>Posts</Title>
    { isLoading ? <Text>loading... </Text> : <>
    {data?.length === 0 && <Text>no posts</Text>}
      {data?.map((p) => <Group key={p.id} position={'apart'}>
        <Text>{p.content}</Text>
        <Menu position={'bottom-end'}>
          <Menu.Target>
            <ActionIcon variant={'light'} >
              <GoGrabber />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item icon={<GoTrashcan />} color='red' onClick={deleteHandler(p.id)}>Delete</Menu.Item>
            <Menu.Item icon={<GoPencil />} color='blue' onClick={() => setUpdateItem(p)}>Update</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>)}
    </>}
    <UpdatePostModal post={updateItem} onClose={() => setUpdateItem(null)} />
  </Stack>
}

export default Posts;
