import { render } from "@testing-library/react";
import { Footer } from "../../components/Footer";

describe("Footer component", () => {
  it("should render correctly", async () => {
    const { getByText } = render(<Footer />);

    expect(getByText("Statistics")).toBeInTheDocument();
  });
});
