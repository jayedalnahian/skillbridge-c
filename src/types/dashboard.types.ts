export type NavItem = {
    title: string;
    href: string;
    icon: string;
};

export type NavSection = {
    title?: string;
    items: NavItem[];
};


export interface PieChartData {
    status: string,
    count: number
}

export interface BarChartData {
    month: Date | string,
    count: number
}


