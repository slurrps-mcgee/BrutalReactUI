import {
  CodeSnippet,
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

const code = `<TableResponsive animate="scroll" shadow rounded>
  <Table bordered striped hoverable>
    <TableHeader>
      <TableRow><TableHead scope="col">Plan</TableHead></TableRow>
    </TableHeader>
    <TableBody>
      <TableRow><TableCell>Starter</TableCell></TableRow>
    </TableBody>
  </Table>
</TableResponsive>`;

const plans = [
  ["Starter", "1", "$9"],
  ["Team", "5", "$29"],
  ["Studio", "Unlimited", "$79"],
];

export default function TablePage() {
  return (
    <Container title="Table" fullWidth animate="scroll" rounded>
      <TableResponsive
        animate="scroll"
        shadow
        rounded
        aria-label="Responsive pricing table"
      >
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
      <TableResponsive
        shadow={false}
        aria-label="Static compact pricing table"
      >
        <Table variant="outline" bordered compact>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Static plan</TableHead>
              <TableHead scope="col">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Starter</TableCell>
              <TableCell>$9</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableResponsive>
      <CodeSnippet code={code} language="tsx" rounded />
    </Container>
  );
}
