import {
  fetchUsers,
  IDepartmentSummary,
  IUser,
  mapDepartment,
} from "./function";

global.fetch = jest.fn();

describe("fetchUsers function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch users successfully", async () => {
    const mockUsers: { users: IUser[] } = {
      users: [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          gender: "male",
          age: 30,
          hair: { color: "black" },
          address: { postalCode: "12345" },
          company: { department: "Engineering" },
        },
        {
          id: 2,
          firstName: "Jane",
          lastName: "Doe",
          gender: "female",
          age: 28,
          hair: { color: "blonde" },
          address: { postalCode: "67890" },
          company: { department: "Marketing" },
        },
      ],
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    });

    const result = await fetchUsers();
    expect(result).toEqual(mockUsers.users);
    expect(fetch).toHaveBeenCalledWith("https://dummyjson.com/users");
  });

  it("should return an empty array if fetch fails", async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const result = await fetchUsers();
    expect(result).toEqual([]);
  });

  it("should map users successfully", async () => {
    const mockUsers: { users: IUser[] } = {
      users: [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          gender: "male",
          age: 30,
          hair: { color: "black" },
          address: { postalCode: "12345" },
          company: { department: "Engineering" },
        },
        {
          id: 2,
          firstName: "James",
          lastName: "Doe",
          gender: "male",
          age: 25,
          hair: { color: "black" },
          address: { postalCode: "54321" },
          company: { department: "Engineering" },
        },
        {
          id: 3,
          firstName: "Jane",
          lastName: "Doe",
          gender: "female",
          age: 28,
          hair: { color: "blonde" },
          address: { postalCode: "67890" },
          company: { department: "Marketing" },
        },
        {
          id: 4,
          firstName: "Jessica",
          lastName: "Doe",
          gender: "female",
          age: 34,
          hair: { color: "blonde" },
          address: { postalCode: "09876" },
          company: { department: "Engineering" },
        },
      ],
    };

    const mockResult: Record<string, IDepartmentSummary> = {
      Engineering: {
        male: 2,
        female: 1,
        ageRange: "25-34",
        hair: {
          black: 2,
          blonde: 1,
        },
        addressUser: {
          JohnDoe: "12345",
          JamesDoe: "54321",
          JessicaDoe: "09876",
        },
      },
      Marketing: {
        male: 0,
        female: 1,
        ageRange: "28-28",
        hair: {
          blonde: 1,
        },
        addressUser: {
          JaneDoe: "67890",
        },
      },
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      })
    ) as jest.Mock;

    const users = await fetchUsers();
    const result = mapDepartment(users);
    expect(result).toEqual(mockResult);
  });

  // it("should return an empty array if response is not OK", async () => {
  //   (fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });

  //   const result = await fetchUsers();
  //   expect(result).toEqual([]);
  // });
});
