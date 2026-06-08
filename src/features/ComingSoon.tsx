import { Construction } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

export function ComingSoon({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <div>
      <Header subtitle={title} showBack />
      <div className="mx-auto max-w-md px-5 py-16 text-center [animation:var(--animate-fade-in)]">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-ink-800 text-ink-300">
          <Construction size={26} />
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-ink-400">
          This mode is being rebuilt on the new platform. The full content is
          preserved and will land here shortly.
        </p>
        <Button className="mt-6" onClick={() => navigate("/")}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
