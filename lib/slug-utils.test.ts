import { clean, slugify } from "./slug-utils";

describe("clean", () => {
  it("removes the two-digit post prefix", () => {
    expect(clean("posts/05-new-year")).toBe("new-year");
  });

  it("leaves paths without a matching prefix unchanged", () => {
    expect(clean("posts/5-new-year")).toBe("posts/5-new-year");
    expect(clean("pages/05-about")).toBe("pages/05-about");
  });
});

describe("slugify", () => {
  it("normalizes text into a lowercase hyphenated slug", () => {
    expect(slugify("  Café: My First Post!  ")).toBe("cafe-my-first-post");
  });

  it("collapses repeated separators and trims hyphens", () => {
    expect(slugify("--Hello___World--")).toBe("hello-world");
  });

  it("returns an empty string for punctuation-only input", () => {
    expect(slugify("!!!")).toBe("");
  });
});

test("cleaned post paths produce the expected slug", () => {
  expect(slugify(clean("posts/16-lebron-james"))).toBe("lebron-james");
});
