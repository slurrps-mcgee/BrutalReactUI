export { default as Badge, type BadgeProps } from "./core/badge";
export { default as Button, type ButtonProps } from "./core/button";
export { default as Container, type ContainerProps } from "./core/container";
export { default as Image, type ImageProps } from "./core/image";
export { default as Input, type InputProps } from "./core/input";
export {
  default as Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardImage,
  type CardProps,
} from "./core/card";
export {
  useAnimationTrigger,
  useEnterViewport,
  type AnimationTrigger,
} from "./utils/use-enter-viewport";
export { default as Link, type LinkProps } from "./core/link";
export { default as ThemeToggle } from "./core/theme-toggle";

export { ThemeProvider, themeNames, useTheme } from "./utils/theme-context";
export type { ColorTheme, ThemePreference } from "./utils/theme-context";

export type {
  Experience,
  Hobby,
  PageMeta,
  Project,
  ProjectCardData,
  ProjectImage,
  SectionHeaderCopy,
  Skill,
  StatPill,
  TechnologyColumn,
} from "./types/types";
