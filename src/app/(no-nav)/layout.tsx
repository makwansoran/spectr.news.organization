import { VantaScripts } from './VantaScripts';

export default function NoNavLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <VantaScripts />
      {children}
    </>
  );
}
