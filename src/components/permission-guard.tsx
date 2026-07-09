import { ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { can, useCurrentUser, type Section, type Perm } from "@/lib/auth-store";

export function PermissionDenied({ label }: { label?: string }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <Card className="max-w-md">
        <CardContent className="p-8 text-center space-y-3">
          <div className="mx-auto h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
            <ShieldAlert className="h-7 w-7 text-red-600" />
          </div>
          <h2 className="text-xl font-bold">Accès refusé</h2>
          <p className="text-sm text-muted-foreground">
            Vous n'avez pas la permission {label ? `de ${label}` : "d'accéder à cette section"}. Contactez un administrateur.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function useCan(section: Section, perm: Perm = "read") {
  const user = useCurrentUser();
  return can(user, section, perm);
}
