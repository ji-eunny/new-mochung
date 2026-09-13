import Cover from '@/components/invitation/Cover';
import Greeting from '@/components/invitation/Greeting';
import Ceremony from '@/components/invitation/Ceremony';
import Gallery from '@/components/invitation/Gallery';
import Accounts from '@/components/invitation/Accounts';
import Closing from '@/components/invitation/Closing';

export default function Home() {
  return <main className="invitation"><Cover /><Greeting /><Ceremony /><Gallery /><Accounts /><Closing /></main>;
}
