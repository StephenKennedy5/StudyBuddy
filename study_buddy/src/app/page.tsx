import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <header className="bg-white flex justify-between p-[16px]">
        <div>Logo</div>
        <div>Create Account</div>
      </header>
      <div className="flex-grow">
        <div className="flex justify-center">Welcome to Study Buddy</div>
        <div>Call to Action</div>
        <div>More Info</div>
        <div>Example of What study page looks like</div>
      </div>
      <footer className="bg-white flex justify-between p-[16px]">
        <div>Footer Bottom Left</div>
        <div>Footer Bottom Right</div>
      </footer>
    </main>
  );
}
