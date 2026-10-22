# Component props

Parents pass the shared props to their children with `SurfaceProvider`. A child prop replaces the parent. An omitted child prop keeps the parent value.

`animate` pops the face. It is only on components that play that entrance. A parent may pass it to children that pop.

## Shared

Every component:

- `disabled`

Every component except links:

- `rounded`
- `border`
- `shadow`

`animate` is listed on the components that pop.

Links are `Link`, `NavLink`, `BreadcrumbLink`, `ListGroupLink`, `PaginationLink`, `PaginationPrevious`, and `PaginationNext`. They take `disabled`. A few of those parts already paint border, radius, or shadow, and those props are listed on the component.

## Accordion

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own:

- `flush`
- `type`
- `value`
- `defaultValue`
- `collapsible` (single only)
- `onValueChange`
- `faceClassName`

### AccordionItem

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `value`, plus the collapse props `className` and `faceClassName`

### AccordionTrigger

Shared: `rounded`, `border`, `shadow`, `disabled`

Own: `headingLevel`, `hideIndicator`

### AccordionContent

Shared: `rounded`, `border`, `shadow`, `disabled`

Own: `innerClassName`

## Alert

Shared: `rounded`, `border`, `shadow`, `disabled`


Own: `variant`, `size`, `title`, `icon`, `actions`, `dismissible`, `open`, `defaultOpen`, `onOpenChange`, `onDismiss`, `timer`, `duration`, `wrapperClassName`, `faceClassName`

## Badge

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

`shadow` stays off unless this badge sets it. `animate` pops the face.

Own: `variant`, `size`, `faceClassName`

## Breadcrumb

Shared: `rounded`, `border`, `shadow`, `disabled`


Own: `variant`, `size`, `label`

### BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator

Own: element attributes only

### BreadcrumbLink

Link. Shared here: `disabled`

Own: `active`, `border` (the underline)

### BreadcrumbPage

Own: `disabled`

## Button

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `variant`, `size`, `fluid`, `wrapperClassName`, `faceClassName`, `fillClassName`, and button attributes

## ButtonGroup

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `orientation`, `selectionMode`, `value`, `defaultValue`, `onValueChange`, `wrapperClassName`, `faceClassName`

### ButtonGroupItem

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `value`, and button attributes

## Card

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `variant`, `size`, `wrapperClassName`, `faceClassName`

### CardHeader, CardBody, CardFooter, CardImage

Shared: `rounded`, `border`, `shadow`, `disabled`


## Carousel

Shared: `rounded`, `border`, `shadow`, `disabled`

Own: `index`, `defaultIndex`, `onIndexChange`, `loop`, `controls`, `indicators`, `autoplay`, `autoplayInterval`, `pauseOnHover`, `pauseOnFocus`, `swipe`, `label`, `wrapperClassName`, `faceClassName`, `viewportClassName`, `trackClassName`

### CarouselSlide

Shared: `rounded`, `border`, `shadow`

## Checkbox

Shared: `rounded`, `border`, `shadow`, `disabled`


Own: `label`, `size`, `wrapperClassName`, `controlClassName`, `faceClassName`, and input attributes

## CodeSnippet

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `code`, `language`, `variant`, `size`, `theme`, `copyLabel`, `copiedLabel`, `showLanguage`, `wrap`, `wrapperClassName`, `faceClassName`

## Collapse

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `open`, `defaultOpen`, `onOpenChange`, `onOpenStart`, `onOpenEnd`, `onCloseStart`, `onCloseEnd`, `duration`, `faceClassName`

### CollapseTrigger

Shared: `rounded`, `border`, `shadow`, `disabled`


Own: `hideIndicator`

### CollapseContent

Shared: `rounded`, `border`, `shadow`, `disabled`


Own: `innerClassName`

## Container

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `title`, `variant`, `size`, `direction`, `align`, `justify`, `gap`, `fluid`, `wrapperClassName`, `faceClassName`

## Dropdown

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `fluid`, `wrapperClassName`

### DropdownToggle

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `variant`, `size`, `caret`, and button attributes

### DropdownItem

Shared: `rounded`, `border`, `shadow`, `disabled`


Own: `href`, `active`, `variant`

### DropdownMenu

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `align`

## FloatingLabel

Shared: `rounded`, `border`, `shadow`, `disabled`


Own: `label`, `htmlFor`, `labelClassName`

## Form

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `variant`, `size`, `wrapperClassName`, `faceClassName`

### FormField, FormLabel, FormFeedback

Shared: `rounded`, `border`, `shadow`, `disabled`


FormField own: `controlId`, `valid`, `invalid`

FormLabel own: `required`

FormFeedback own: `state`, `forceMount`

## Image

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `image`, `title`, `size`, `wrapperClassName`, `faceClassName`

## Input

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `size`, `wrapperClassName`, `faceClassName`, and input attributes except `size`

## InputGroup

Shared: `rounded`, `border`, `shadow`, `disabled`

Own: `orientation`, `label`, `wrapperClassName`, `faceClassName`

### InputGroupText

Shared: `rounded`, `border`, `shadow`, `disabled`


## Link

Shared: `disabled` only

Own: `href`, `variant`, `size`, `wrapperClassName`, `faceClassName`, `fillClassName`

## ListGroup

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `variant`, `size`, `wrapperClassName`, `faceClassName`

### ListGroupItem, ListGroupButton

Shared: `rounded`, `border`, `shadow`, `disabled`

Own: `active`

### ListGroupLink

Link. It already takes `rounded`, `border`, `shadow`, and `disabled`.

Own: `href`, `active`

## Modal

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `open`, `defaultOpen`, `onOpenChange`, `closeOnEscape`, `closeOnBackdrop`, `centered`, `scrollable`, `variant`, `size`, `wrapperClassName`, `faceClassName`

`animate` on Modal is a boolean.

### ModalHeader, ModalBody, ModalFooter

Shared: `rounded`, `border`, `shadow`, `disabled`


### ModalClose

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

## Nav

Shared: `rounded`, `border`, `shadow`, `disabled`

The list does not pop. NavItem and NavLink do.

Own: `direction`

### NavItem, NavGroup

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

NavGroup own: `label`, `open`, `defaultOpen`, `onOpenChange`, `icon`, `variant`, `size`

### NavLink

Link. It already takes `rounded`, `border`, `shadow`, `animate`, and `disabled`.

Own: `href`, `active`, `variant`, `size`, `icon`

## Navbar

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `variant`, `size`, `sticky`, `wrapperClassName`, `faceClassName`

### NavbarBrand, NavbarCollapse

Shared: `rounded`, `border`, `shadow`, `disabled`


NavbarBrand own: `href`

NavbarCollapse own: `open`

## Pagination

Shared: `rounded`, `border`, `shadow`, `disabled`


Own: `variant`, `size`, `label`

### PaginationList, PaginationItem, PaginationEllipsis

Own: element attributes only

### PaginationLink, PaginationPrevious, PaginationNext

Links. They take `disabled`, `rounded`, `shadow`, and `border`. They do not take `animate`.

Own: `active`, `href`, `wrapperClassName`, `faceClassName`. Previous and next also take `label`.

## Progress

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `variant`, `size`, `value`, `max`, `label`, `showValue`, `wrapperClassName`, `faceClassName`, `indicatorClassName`

## Radio

Shared: `rounded`, `border`, `shadow`, `disabled`


Own: `label`, `size`, `wrapperClassName`, `controlClassName`, `faceClassName`, and input attributes

## Range

Shared: `rounded`, `border`, `shadow`, `disabled`


Own: `label`, `showValue`, `output`, `wrapperClassName`, and input attributes except `type`

## Select

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `variant`, `size`, `value`, `defaultValue`, `onValueChange`, `open`, `defaultOpen`, `onOpenChange`, `placeholder`, `name`, `required`, `valid`, `invalid`, `wrapperClassName`, `faceClassName`, `triggerClassName`, `menuClassName`

### SelectOption

Shared: `rounded`, `border`, `shadow`, `disabled`

Own: `value`, `textValue`

## Sidebar

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `variant`, `size`, `collapsed`, `offcanvas`, `open`, `onClose`, `wrapperClassName`, `faceClassName`

### Offcanvas

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `variant`, `size`, `open`, `onClose`

## Skeleton

Shared: `rounded`, `border`, `shadow`, `disabled`

The pulse or wave is `animation`.

Own: `variant`, `animation`, `label`

## Spinner

Shared: `rounded`, `border`, `shadow`, `disabled`

The spin is the component's own motion.

Own: `variant`, `size`, `label`

## Table

Shared: `rounded`, `border`, `shadow`, `disabled`

Own: `variant`, `size`, `bordered`, `striped`, `hoverable`, `compact`, `stickyHeader`

### TableResponsive

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `wrapperClassName`, `faceClassName`

### TableHeader

Shared: `rounded`, `border`, `shadow`, `disabled`


### TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption

Own: element attributes, plus the table context for stripe, hover, and compact padding

## ThemeToggle

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `align`, `className`

## Toast

Shared: `rounded`, `border`, `shadow`, `disabled`


Own: `variant`, `size`, `title`, `description`, `action`, `icon`, `dismissible`, `timer`, `duration`, `open`, `defaultOpen`, `onOpenChange`, `onDismiss`, `wrapperClassName`, `faceClassName`

### ToastProvider

Own: `timer`, `duration`, `maxToasts`

### ToastViewport

Own: `position`, `portal`

## Toggler

Shared: `rounded`, `border`, `shadow`, `animate`, `disabled`

Own: `variant`, `size`, `expanded`, `controls`, `iconAnimation`, `wrapperClassName`, `faceClassName`

## Tooltip

Shared: `rounded`, `border`, `shadow`, `disabled`


Own: `delay`

### TooltipTrigger

Shared: `rounded`, `border`, `shadow`, `disabled`


Own: `asChild`

### TooltipContent

Shared: `rounded`, `border`, `shadow`, `disabled`


Own: `variant`, `size`, `placement`, `wrapperClassName`, `faceClassName`
