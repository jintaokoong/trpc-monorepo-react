import { KeyboardEventHandler, Suspense, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { trpc } from "../App";

const Greeter = () => {
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState('');
  
  const { data, isLoading, refetch } = trpc.useQuery(['posts']);
  const { mutate: createMutation, } = trpc.useMutation(['createPost']);
  
  const createPost: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== "Enter") {
      return;
    }
    createMutation({
      content: content,
    }, {
      onSuccess: () => {
        setContent('');
      },
      onError: (error) => {
        setError(error.message);
      },
      onSettled: () => {
        refetch();
      }
    })
  }

  return <>
    <h4>Create New Post</h4>
    <div style={{ display: 'flex', marginBottom: '10px' }}>
      <input
        style={{ flex: 1 }} 
        value={content} 
        onChange={(e) => setContent(e.currentTarget.value)} 
        onKeyUp={createPost}
      />
    </div>
    <h4>Posts</h4>
    { isLoading ? <p>loading... </p> : <>
    {data?.length === 0 && <p>no posts</p>}
      {data?.map((p) => <p key={p.id}>{p.content}</p>)}
    </>}
  </>
}

export default Greeter;
