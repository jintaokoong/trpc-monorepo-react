import { trpc } from "../App";

const Greeter = () => {
  const { data } = trpc.useQuery(['hello']);
  return <div>Greeting {data?.greeting}</div>
}

export default Greeter;
