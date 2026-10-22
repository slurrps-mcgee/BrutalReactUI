# Surface and the component template

`lib/utils/surface.tsx` decides which chrome a component paints. `lib/utils/template.tsx` is the reference shape. Do not import the template into the app. Copy its structure into a core component.

Shared tokens live in `lib/styles/index.css`:

| Token            | Role                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------- |
| `--border-width` | `3px`. Resting CSS borders share this width.                                          |
| `--radius`       | `0.375rem`. Outer corner of a rounded face.                                           |
| `--shadow`       | Hard offset, `var(--shadow-offset-x) var(--shadow-offset-y) 0 0 var(--shadow-color)`. |
| `--border`       | Stroke and shadow color.                                                              |

## Surface

A surface is five optional flags: `rounded`, `border`, `shadow`, `animate`, and `disabled`.

`SurfaceProvider` publishes them on context. Each provider merges with the provider above it. A value passed to this provider replaces the parent. An omitted value keeps the parent value, including when that parent value is itself unset.

```ts
rounded: rounded ?? parent.rounded;
```

The same line runs for `disabled`, `border`, `shadow`, and `animate`. The root context is `{}`, so an unset flag stays `undefined` until some provider writes it.

Components read the context through three hooks. Each one resolves in the same order: the component's own prop, then the context, then a default.

| Hook                             | Default when the prop and every ancestor are unset |
| -------------------------------- | -------------------------------------------------- |
| `useSurfaceFlag(own, "border")`  | `true`                                             |
| `useSurfaceFlag(own, "shadow")`  | `true`                                             |
| `useSurfaceFlag(own, "rounded")` | `false`                                            |
| `useSurfaceAnimate(own)`         | `false`                                            |
| `useSurfaceDisabled(own)`        | `false`                                            |

`false` is a real value. `<Card rounded={false}>` inside a rounded parent stays square. Omitting `rounded` on that card keeps the parent's `true`.

Pass the raw prop into `SurfaceProvider`, not the resolved boolean. The template does this:

```tsx
<SurfaceProvider rounded={roundedProp} disabled={disabledProp}>
```

`roundedProp` is still `undefined` when the caller omitted it, so this provider does not freeze a resolved `true` or `false` onto its children. Children keep looking up the tree. Sidebar and Navbar also pass the raw `shadow`, `border`, and `animate` props, so a nav item follows the bar or the rail when those were set, and otherwise keeps its own default. Most other components only forward `rounded` and `disabled`.

`InputGroup` is the exception that publishes a concrete value on purpose. It passes `rounded={false}` so a child does not paint a full radius and split the row. The group paints the outer corners itself.

### What the flags paint

`surfaceClasses` emits a utility only when the flag is `true`. An omitted or `false` flag adds no class, so the element's current face stays as it is.

| Flag       | Class when true                                     |
| ---------- | --------------------------------------------------- |
| `rounded`  | `rounded-[var(--radius)]`                           |
| `border`   | `border-[length:var(--border-width)] border-border` |
| `shadow`   | `shadow-[var(--shadow)]`                            |
| `disabled` | `pointer-events-none opacity-70`                    |

`borderPaintClass(border)` paints the resting stroke: `border-[length:var(--border-width)] border-border` when `border` is true, and `border-none` when it is false.

`faceRadiusClass` returns `rounded-[var(--radius)]` when `rounded` is true.

## Template

The template is a reference component. Its file order is the order new components use. Skip a section that would be empty.

1. Style consts (`cva` or class strings)
2. Functions (hooks and helpers, not the components)
3. Props for the root
4. `export default function` for the root
5. Children props
6. Children functions

A compound alias such as `Accordion.Item` follows the children.

`className` and `faceClassName` merge onto the face, `className` last. `wrapperClassName` merges onto the shadow wrapper. `faceClassName` is for the bordered face. `fillClassName` is for the hover-fill span. A component with no shadow skips the wrapper.

### DOM

The pop selector requires the face to be the wrapper's direct child: `.animate-brutal-pop > .brutal-pop-face`.

```text
div.wrapper          ref, shadow, radius, animate-brutal-pop, data-pop-direction="out"
  div.face           border paint, brutal-pop-face, radius, disabled
    span             fill, absolute inset-0, pointer-events none
    SurfaceProvider  raw rounded and disabled props
      span           relative z-10
        children
```

The wrapper is `relative isolate`. It is `flex w-full` when `fluid` is set, and `inline-flex w-fit` otherwise. The shadow utility lives here, so the offset stays put while the face moves. `rounded` on the wrapper paints the same outer radius as the face.

The face is `relative z-10 isolate flex`, with the variant fill, mono bold uppercase type, and the size padding. `borderPaintClass` adds the resting border. `disabled` adds `pointer-events-none opacity-70` and `aria-disabled`.

The fill span is an empty `absolute inset-0` layer. Components pass a hover background through `fillClassName`. Children sit in the `relative z-10` span above that fill.

### Entrance

`useAnimationTrigger` maps the public `animate` prop:

| `animate`          | Result                                                                                                                                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| omitted or `false` | `shouldAnimate` is false. The face stays put.                                                                                                                                                                  |
| `true`             | `shouldAnimate` is true on mount.                                                                                                                                                                              |
| `"scroll"`         | An `IntersectionObserver` at `threshold: 0.1` sets `shouldAnimate` the first time the wrapper intersects, then disconnects. `prefers-reduced-motion` never counts as entered, so a scroll entrance is skipped. |

When `shouldAnimate` is true the wrapper gets `animate-brutal-pop` and `data-pop-direction="out"`, and the face gets `brutal-pop-face`. The face translates from `--shadow-offset-x` / `--shadow-offset-y` back to `0` over `450ms`. The shadow is a `box-shadow` on the wrapper, so the face slides off that offset and back to rest. `shadow={false}` omits the shadow utility. The face still rests at `0`, and the pop translate still runs when the entrance is on.

`animate` belongs only on a component that plays this pop. A parent may pass it through `SurfaceProvider` to children that play it.

### Variant surface variables

The template variants write the variables an outline child reads:

| Variant     | Fill                  | `--surface`      | `--outline-button-fill` |
| ----------- | --------------------- | ---------------- | ----------------------- |
| `primary`   | `bg-main`             | `var(--main)`    | `var(--chart-2)`        |
| `secondary` | `bg-chart-2`          | `var(--chart-2)` | `var(--main)`           |
| `outline`   | `bg-[var(--surface)]` | inherited        | inherited               |

An outline face cuts out of the parent surface and uses the parent ink. A primary parent points the outline button's hover fill at `chart-2`. A secondary parent points it back at `main`.
