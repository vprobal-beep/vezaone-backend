import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  PermissionCapability,
  RoleDefinition,
} from "@/src/wireframe/types"

interface PermissionsMatrixProps {
  title?: string
  description?: string
  capabilities: PermissionCapability[]
  roles: RoleDefinition[]
  onToggleCapability: (roleId: string, capabilityId: string) => void
  onSave?: () => void
}

export function PermissionsMatrix({
  title = "Role Permissions Matrix",
  description = "Configure backend resource access capabilities per workspace role.",
  capabilities,
  roles,
  onToggleCapability,
  onSave,
}: PermissionsMatrixProps) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="font-heading text-base font-semibold">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Capability</TableHead>
              {roles.map((role) => (
                <TableHead key={role.id} className="text-center w-28">
                  {role.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {capabilities.map((cap) => (
              <TableRow key={cap.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{cap.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {cap.area} · {cap.description}
                    </span>
                  </div>
                </TableCell>
                {roles.map((role) => (
                  <TableCell key={role.id} className="text-center">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={Boolean(role.capabilities[cap.id])}
                        onCheckedChange={() =>
                          onToggleCapability(role.id, cap.id)
                        }
                        aria-label={`${role.name} ${cap.label}`}
                      />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {onSave && (
        <CardFooter className="border-t pt-4 justify-end">
          <Button size="sm" onClick={onSave}>
            Save Policy Matrix
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
