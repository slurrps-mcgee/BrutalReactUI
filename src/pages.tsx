import AccordionPage from "./pages/accordion";
import AlertPage from "./pages/alert";
import BadgesPage from "./pages/badges";
import BreadcrumbPage from "./pages/breadcrumb";
import ButtonGroupPage from "./pages/button-group";
import ButtonsPage from "./pages/buttons";
import CardsPage from "./pages/cards";
import CarouselPage from "./pages/carousel";
import CheckboxPage from "./pages/checkbox";
import CodeSnippetPage from "./pages/code-snippet";
import CollapsePage from "./pages/collapse";
import DropdownPage from "./pages/dropdown";
import FloatingLabelPage from "./pages/floating-label";
import FormPage from "./pages/form";
import HomePage from "./pages/home";
import ImagePage from "./pages/image";
import InputGroupPage from "./pages/input-group";
import InputsPage from "./pages/inputs";
import LinksPage from "./pages/links";
import ListGroupPage from "./pages/list-group";
import ModalPage from "./pages/modal";
import NavbarPage from "./pages/navbar";
import PaginationPage from "./pages/pagination";
import ProgressPage from "./pages/progress";
import RadioPage from "./pages/radio";
import RangePage from "./pages/range";
import SelectPage from "./pages/select";
import SidebarPage from "./pages/sidebar";
import SkeletonPage from "./pages/skeleton";
import SpinnerPage from "./pages/spinner";
import TablePage from "./pages/table";
import ToastPage from "./pages/toast";
import TooltipPage from "./pages/tooltip";
import ValidationPage from "./pages/validation";

const pageMap = {
  accordion: AccordionPage,
  alert: AlertPage,
  badges: BadgesPage,
  breadcrumb: BreadcrumbPage,
  "button-group": ButtonGroupPage,
  buttons: ButtonsPage,
  cards: CardsPage,
  carousel: CarouselPage,
  checkbox: CheckboxPage,
  "code-snippet": CodeSnippetPage,
  collapse: CollapsePage,
  dropdown: DropdownPage,
  "floating-label": FloatingLabelPage,
  form: FormPage,
  home: HomePage,
  image: ImagePage,
  "input-group": InputGroupPage,
  inputs: InputsPage,
  links: LinksPage,
  "list-group": ListGroupPage,
  modal: ModalPage,
  navbar: NavbarPage,
  pagination: PaginationPage,
  progress: ProgressPage,
  radio: RadioPage,
  range: RangePage,
  select: SelectPage,
  sidebar: SidebarPage,
  skeleton: SkeletonPage,
  spinner: SpinnerPage,
  table: TablePage,
  toast: ToastPage,
  tooltip: TooltipPage,
  validation: ValidationPage,
} as const;

export type PageId = keyof typeof pageMap;

export function PageView({ id }: { id: string }) {
  const Page = pageMap[id as PageId] ?? HomePage;
  return <Page />;
}
