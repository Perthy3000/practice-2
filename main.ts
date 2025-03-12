interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  hair: {
    color: string;
  };
  address: {
    postalCode: string;
  };
  company: {
    department: string;
  };
}

interface IDepartmentSummary {
  male: number;
  female: number;
  ageRange: string;
  hair: Record<string, number>;
  addressUser: Record<string, string>;
}

const fetchUsers = async (): Promise<IUser[]> => {
  try {
    const response = await fetch("https://dummyjson.com/users");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    return data.users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

const mapDepartment = (users: IUser[]) => {
  const departmentMap: Record<string, IDepartmentSummary> = {};

  users.forEach((user) => {
    const { company, gender, age, hair, firstName, lastName, address } = user;
    if (!departmentMap[company.department]) {
      departmentMap[company.department] = {
        male: 0,
        female: 0,
        ageRange: [Infinity, 0].join("-"),
        hair: {},
        addressUser: {},
      };
    }

    if (gender === "male") {
      departmentMap[company.department].male += 1;
    } else {
      departmentMap[company.department].female += 1;
    }

    const [minAge, maxAge] = departmentMap[company.department].ageRange
      .split("-")
      .map(Number);
    let [newMin, newMax] = [minAge, maxAge];
    if (age > maxAge) {
      newMax = age;
    }
    if (age < minAge) {
      newMin = age;
    }
    departmentMap[company.department].ageRange = [newMin, newMax].join("-");

    if (!departmentMap[company.department].hair[hair.color]) {
      departmentMap[company.department].hair[hair.color] = 0;
    }

    departmentMap[company.department].hair[hair.color] += 1;

    departmentMap[company.department].addressUser[`${firstName}${lastName}`] =
      address.postalCode;
  });

  return departmentMap;
};

(async () => {
  const users = await fetchUsers();

  const departmentMap = mapDepartment(users);

  console.log(departmentMap);
})();
