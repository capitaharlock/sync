// TODO: Remove at after discussion with RJ
export default function TestingLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <>
        <main>
          {children}
        </main>
  
      </>
  
    );
  }