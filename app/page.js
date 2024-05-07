import { NotesTaker } from '@/components/component/notes-taker'

export async function getServerSideProps(){
  try {
    const res = await fetch('/api/tasks');
    const tasks = await res.json();

    return {
      props: {
        tasks,
      },
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return {
      props: {
        tasks: [],
      },
    };
  }
}

export default function Home({tasks}) {
  return (
    <NotesTaker tasks={tasks}/>
  )
}
