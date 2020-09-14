import { isRecent } from "../is-recent";

const ONE_DAY_IN_MS = 3600 * 24 * 1000;

describe("isRecent", () => {
  it("returns true if the publication date is less than 2 days ago", () => {
    const todayDate = new Date();
    const publicationDate = new Date(+todayDate - ONE_DAY_IN_MS);

    expect(isRecent({ todayDate, publicationDate })).toBe(true);
  });
  it("returns false if the publication date is older than 2 days", () => {
    const todayDate = new Date();
    const publicationDate = new Date(+todayDate - 3 * ONE_DAY_IN_MS);

    expect(isRecent({ todayDate, publicationDate })).toBe(false);
  });

  it("returns true if the publication date is 2 days old", () => {
    const todayDate = new Date();
    const publicationDate = new Date(+todayDate - 2 * ONE_DAY_IN_MS);

    expect(isRecent({ todayDate, publicationDate })).toBe(true);
  });
});
