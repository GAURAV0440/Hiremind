import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "../components/logo";
import { Button } from "../components/ui/button";

export default function NotFoundPage() {
  return <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center"><Logo /><p className="mt-12 text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">404</p><h1 className="mt-4 text-4xl font-medium tracking-tight">This page wandered off.</h1><p className="mt-3 text-sm text-ink-500 dark:text-ink-400">The route you requested does not exist.</p><Link to="/" className="mt-7"><Button><ArrowLeft className="size-4" /> Back home</Button></Link></main>;
}
