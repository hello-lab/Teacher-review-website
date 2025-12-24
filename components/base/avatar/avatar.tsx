"use client";

import { type FC, type ReactNode, useState } from "react";
import { User01 } from "@untitledui/icons";
import { cx } from "@/lib/utils/cx";
import { AvatarOnlineIndicator, VerifiedTick } from "./base-components";

type AvatarSize = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface AvatarProps {
    size?: AvatarSize;
    className?: string;
    src?: string | null;
    alt?: string;
    /**
     * Display a contrast border around the avatar.
     */
    contrastBorder?: boolean;
    /**
     * Display a badge (i.e. company logo).
     */
    badge?: ReactNode;
    /**
     * Display a status indicator.
     */
    status?: "online" | "offline";
    /**
     * Display a verified tick icon.
     *
     * @default false
     */
    verified?: boolean;

    /**
     * The initials of the user to display if no image is available.
     */
    initials?: string;
    /**
     * An icon to display if no image is available.
     */
    placeholderIcon?: FC<{ className?: string }>;
    /**
     * A placeholder to display if no image is available.
     */
    placeholder?: ReactNode;

    /**
     * Whether the avatar should show a focus ring when the parent group is in focus.
     * For example, when the avatar is wrapped inside a link.
     *
     * @default false
     */
    focusable?: boolean;
}

const styles = {
    xxs: { root: "size-4", initials: "text-xs font-semibold", icon: "size-3" },
    xs: { root: "size-6", initials: "text-xs font-semibold", icon: "size-4" },
    sm: { root: "size-8", initials: "text-sm font-semibold", icon: "size-5" },
    md: { root: "size-10", initials: "text-md font-semibold", icon: "size-6" },
    lg: { root: "size-12", initials: "text-lg font-semibold", icon: "size-7" },
    xl: { root: "size-14", initials: "text-xl font-semibold", icon: "size-8" },
    "2xl": { root: "size-16", initials: "text-display-xs font-semibold", icon: "size-8" },
};

export const Avatar = ({
    contrastBorder = true,
    size = "md",
    src,
    alt,
    initials,
    placeholder,
    placeholderIcon: PlaceholderIcon,
    badge,
    status,
    verified,
    focusable = false,
    className,
}: AvatarProps) => {
    const [isFailed, setIsFailed] = useState(false);

    const renderMainContent = () => {
        if (src && !isFailed) {
            return <img data-avatar-img className="size-full rounded-full object-cover" src={src} alt={alt} onError={() => setIsFailed(true)} />;
        }

        if (initials) {
            return <span className={cx("text-quaternary", styles[size].initials)}>{initials}</span>;
        }

        if (PlaceholderIcon) {
            return <PlaceholderIcon className={cx("text-fg-quaternary", styles[size].icon)} />;
        }

        return placeholder || <User01 className={cx("text-fg-quaternary", styles[size].icon)} />;
    };

    const renderBadgeContent = () => {
        if (status) {
            return <AvatarOnlineIndicator status={status} size={size === "xxs" ? "xs" : size} />;
        }

        if (verified) {
            return (
                <VerifiedTick
                    size={size === "xxs" ? "xs" : size}
                    className={cx("absolute right-0 bottom-0", (size === "xxs" || size === "xs") && "-right-px -bottom-px")}
                />
            );
        }

        return badge;
    };

    return (
        <div
            data-avatar
            className={cx(
            "relative inline-flex shrink-0 items-center justify-center rounded-full bg-avatar-bg ring-0",
                // Focus styles
                focusable && "group-focus-visible:ring-2 group-focus-visible:ring-offset-2 group-focus-visible:ring-primary",
                contrastBorder && "ring-2 ring-avatar-contrast-border",
                styles[size].root,
                className,
            )}
        >
            {renderMainContent()}
            {renderBadgeContent()}
        </div>
    );
};
