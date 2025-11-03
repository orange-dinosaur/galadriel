import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SquarePenIcon } from 'lucide-react';

export function NavActions() {
    return (
        <SidebarGroup className="pt-8">
            <SidebarMenu>
                <Dialog>
                    <form>
                        <DialogTrigger asChild>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Create new project"
                                    className="cursor-pointer"
                                    onClick={() => console.log('NEW PROJECT')}>
                                    <span>
                                        <SquarePenIcon />
                                        <span>Create new project</span>
                                    </span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create new project</DialogTitle>
                                <DialogDescription>
                                    Choose your project name
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Name</Label>
                                    <Input
                                        id="name-1"
                                        name="name"
                                        placeholder="my project"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Create</Button>
                            </DialogFooter>
                        </DialogContent>
                    </form>
                </Dialog>
            </SidebarMenu>
        </SidebarGroup>
    );
}
