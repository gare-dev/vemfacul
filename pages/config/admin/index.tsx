import AdminSidebar, { navItemsType } from "@/components/AdminSidebar";
import CoursesApprovalList from "@/components/Common/Admin/CoursesApprovalList";
import { JSX, useState } from "react"
import { FaListCheck } from "react-icons/fa6";

export default function Admin() {
    const navItems: navItemsType[] = [
        { icon: <FaListCheck />, name: "aprovar_cursinho", label: "Aprovar Cursinhos", renderFn: () => <CoursesApprovalList /> },
    ]

    const [render, setRender] = useState<JSX.Element>();
    const [activeItem, setActiveItem] = useState<string>("");

    return (
        <div>
            <AdminSidebar
                navItems={navItems}
                activeItem={activeItem}
                setRender={(render) => setRender(render)}
                setActiveItem={setActiveItem}
            />
            {render}
        </div>
    )
}
