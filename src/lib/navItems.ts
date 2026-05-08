import { NavSection } from "@/types/dashboard.types";
import { getDefaultDashboardRoute, UserRole } from "./authUtils";



export const getCommonNavItems = (role : UserRole) : NavSection[] => {
    const defaultDashboard = getDefaultDashboardRoute(role);
    return [
        {
            items : [
                {
                    title : "Home",
                    href : "/",
                    icon : "Home"
                },
                {
                    title : "Dashboard",
                    href : defaultDashboard,
                    icon : "LayoutDashboard"

                },
                {
                    title: "My Profile",
                    href: `/my-profile`,
                    icon: "User",
                },
            ]
        },
    ]
}


export const tutorNavItems : NavSection[] = [
    {
        title: "Tutor Dashboard",
        items : [
            {
                title: "Availability",
                href: "/tutor/availability",
                icon: "FileSignature",
            },
            {
                title: "My Bookings",
                href: "/tutor/bookings",
                icon: "School",
            },
            {
                title: "Reviews",
                href: "/tutor/reviews",
                icon: "Star",
            },
            {
                title: "Payments",
                href: "/tutor/payments",
                icon: "CreditCard",
            }
        ]
    }
]

export const adminNavItems: NavSection[] = [
    {
        title: "User Management",
        items: [
            {
                title: "Admins",
                href: "/admin/admins",
                icon: "Shield",
            },
            {
                title: "Tutors",
                href: "/admin/tutors",
                icon: "UserCog",
            },
            {
                title: "Students",
                href: "/admin/students",
                icon: "GraduationCap",
            },
        ],
    },
    {
        title: "Application Management",
        items: [
            {
                title: "Bookings",
                href: "/admin/bookings",
                icon: "DoorOpen",
            },
            {
                title: "Categories",
                href: "/admin/categories",
                icon: "BookOpen",
            },
            
        ],
    },
];

export const studentNavItems: NavSection[] = [
    {
        title: "Student Dashboard",
        items: [
            {
                title: "My Bookings",
                href: "/dashboard/bookings",
                icon: "FileText",
            },
            {
                title: "Reviews",
                href: "/dashboard/reviews",
                icon: "Award",
            },
            {
                title: "Payments",
                href: "/dashboard/payments",
                icon: "Wallet",
            }
        ]
    },
];

export const getNavItemsByRole = (role : UserRole) : NavSection[] => {
    try {
        const commonNavItems = getCommonNavItems(role) || [];

        switch (role) {
            case "ADMIN":
                return [...commonNavItems, ...(adminNavItems || [])];

            case "TUTOR":
                return [...commonNavItems, ...(tutorNavItems || [])];

            case "STUDENT":
                return [...commonNavItems, ...(studentNavItems || [])];

            default:
                return commonNavItems;
        }
    } catch (error) {
        console.error("Error in getNavItemsByRole:", error);
        return [];
    }
}