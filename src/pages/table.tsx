import {
  Container,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableResponsive,
  TableRow,
} from "../../lib/main";
import { tableNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

const plans = [
  ["Starter", "1", "$9"],
  ["Team", "5", "$29"],
  ["Studio", "Unlimited", "$79"],
];

export default function TablePage() {
  return (
    <Container title="Table" fullWidth animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        Tables list comparable data. TableResponsive frames the table and
        scrolls sideways when the columns do not fit.
      </p>

      <Example
        title="Bordered, striped, and hoverable"
        summary="bordered draws one grid. striped tints every other row. hoverable marks the row under the pointer."
        code={`<TableResponsive shadow rounded>
  <Table bordered striped hoverable>
    <TableCaption>Monthly pricing in USD.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead scope="col">Plan</TableHead>
        <TableHead scope="col">Projects</TableHead>
        <TableHead scope="col">Price</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableHead scope="row">Starter</TableHead>
        <TableCell>1</TableCell>
        <TableCell>$9</TableCell>
      </TableRow>
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell colSpan={2}>Three plans</TableCell>
        <TableCell>Cancel anytime</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
</TableResponsive>`}
      >
        <TableResponsive shadow rounded aria-label="Responsive pricing table">
          <Table variant="secondary" bordered striped hoverable>
            <TableCaption>
              Monthly pricing in USD. Scroll horizontally on small screens.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Plan</TableHead>
                <TableHead scope="col">Projects</TableHead>
                <TableHead scope="col">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map(([plan, projects, price]) => (
                <TableRow key={plan}>
                  <TableHead scope="row">{plan}</TableHead>
                  <TableCell>{projects}</TableCell>
                  <TableCell>{price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>Three plans</TableCell>
                <TableCell>Cancel anytime</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableResponsive>
      </Example>

      <Example
        title="Plain rows"
        summary="Leave bordered off when row dividers are enough. size sm tightens the cells."
        code={`<Table size="sm">
  <TableHeader>
    <TableRow>
      <TableHead scope="col">Name</TableHead>
      <TableHead scope="col">Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Ada</TableCell>
      <TableCell>Engineer</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
      >
        <Table size="sm">
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Name</TableHead>
              <TableHead scope="col">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Ada</TableCell>
              <TableCell>Engineer</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Grace</TableCell>
              <TableCell>Admiral</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Example>

      <Example
        title="Flat frame"
        summary="TableResponsive shadow false removes the offset. A bordered table keeps one grid, without a second frame stroke."
        code={`<TableResponsive shadow={false}>
  <Table bordered>
    <TableBody>
      <TableRow>
        <TableCell>Flat</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableResponsive>`}
      >
        <TableResponsive shadow={false}>
          <Table bordered>
            <TableBody>
              <TableRow>
                <TableCell>Flat</TableCell>
                <TableCell>One grid</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableResponsive>
      </Example>

      <ComponentNotes {...tableNotes} />
    </Container>
  );
}
