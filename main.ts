import { fetchUsers, mapDepartment } from "./function";

(async () => {
  const users = await fetchUsers();

  const departmentMap = mapDepartment(users);

  console.log(departmentMap);
})();
