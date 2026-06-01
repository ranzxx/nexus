import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  insertMock: vi.fn(),
  valuesMock: vi.fn(),
  returningMock: vi.fn(),
  getSessionMock: vi.fn(),
  headersMock: vi.fn(),
  redirectMock: vi.fn(),
  revalidatePathMock: vi.fn(),
}));

vi.mock("@/db/drizzle", () => ({
  db: {
    insert: mocks.insertMock,
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: mocks.getSessionMock,
    },
  },
}));

vi.mock("next/headers", () => ({
  headers: mocks.headersMock,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirectMock,
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePathMock,
}));

describe("conversation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();

    mocks.insertMock.mockReturnValue({
      values: mocks.valuesMock,
    });

    mocks.valuesMock.mockReturnValue({
      returning: mocks.returningMock,
    });

    mocks.returningMock.mockResolvedValue([
      {
        id: "test-id",
        title: "New Chat",
        userId: "user-id",
        documentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    mocks.getSessionMock.mockResolvedValue({
      user: {
        id: "user-id",
        name: "Test User",
        email: "test@test.com",
      },
    });

    mocks.headersMock.mockResolvedValue(new Headers());

    mocks.redirectMock.mockImplementation((path: string) => {
      throw new Error(`NEXT_REDIRECT:${path}`);
    });
  });

  it("createConversation membuat conversation dengan user yang sedang login", async () => {
    const { createConversation } = await import("@/actions/conversation");

    const conv = await createConversation();

    expect(mocks.valuesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "New Chat",
        userId: "user-id",
        documentId: null,
      }),
    );

    expect(conv).toEqual(
      expect.objectContaining({
        id: "test-id",
        title: "New Chat",
        userId: "user-id",
      }),
    );
  });

  it("createConversation menyimpan documentId kalau dikirim", async () => {
    const { createConversation } = await import("@/actions/conversation");

    await createConversation("doc-id");

    expect(mocks.valuesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-id",
        documentId: "doc-id",
      }),
    );
  });

  it("createConversation tidak insert ke database kalau user belum login", async () => {
    mocks.getSessionMock.mockResolvedValueOnce(null);

    const { createConversation } = await import("@/actions/conversation");

    await expect(createConversation()).rejects.toThrow("NEXT_REDIRECT");

    expect(mocks.insertMock).not.toHaveBeenCalled();
    expect(mocks.redirectMock).toHaveBeenCalled();
  });
});
