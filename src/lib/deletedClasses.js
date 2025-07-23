// 키 이름
const STORAGE_KEY = "deletedHostClasses";

/** 저장된 삭제 ID 배열 반환 */
export function getDeletedClasses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

/** ID를 삭제 배열에 추가 */
export function addDeletedClass(id) {
  const list = getDeletedClasses();
  if (!list.includes(id)) {
    list.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
}

/** ID 배열 전체 덮어쓰기 */
export function setDeletedClasses(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
