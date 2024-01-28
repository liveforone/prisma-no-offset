"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLastIdOrDefault = exports.ltLastIdCondition = void 0;
/**
 * <ENG>
 * This code requires definition only.
 * When converted to json, it is cast and returned as a string.
 */
/**
 * <KOR>
 * 이 코드는 정의만 필요로 합니다. 직접 사용할 일은 없을 겁니다.
 * json으로 변환시 문자열로 캐스팅되어 리턴합니다. 클라이언트에게 bigint타입을 리턴시 string으로 리턴됩니다.
 */
BigInt.prototype.toJSON = function () {
    return this.toString();
};
/**
 *
 * @param lastId
 * @returns prisma where condition
 * <ENG>
 * This function is a utility function used to create a clause in the no offset paging based on the descending order of id.
 * The id must be set to the bigint type.
 * Returns an empty query if the lastId is 0 or less than 0(less than & euqal == lte). prisma ignores this empty query.
 * If a normal lastId comes in, this function looks for id less than lastId.
 * When you use this utility function in a single condition, you just need to call the function.
 * However, when using multiple conditions, it is desirable to filter the necessary conditions and then call the function as the last condition.
 * Because if there's a lot of data in the database and the current page is a relatively recent page,
 * Calling this function first is not at all efficient because all data that meet conditions less than id are filtered first.
 * ex1(single condition) : where: lastIdCondition
 * ex2(multiple condition) : where: { AND: [{ column: agrs }, lastIdCondition], },
 */
/**
 *
 * @param lastId
 * @returns prisma where condition
 * <KOR>
 * 이 함수는 id 내림차순 기반의 No offset 페이징의 where절을 만드는데 사용하는 유틸함수입니다.
 * id는 반드시 bigint 타입으로 구성해야합니다.
 * lastId가 0혹은 0보다 작을경우 빈 쿼리를 리턴합니다. prisma는 이 빈쿼리를 무시합니다.
 * 정상적인 lastId가 들어온다면, lastId 보다 작은 id를 기준으로 찾도록 합니다.
 * 이 유틸함수를 단일 조건에서 사용할 때는 큰 문제없이 함수를 호출하면됩니다.
 * 그러나 여러 조건에서 사용할 때에는 필요한 조건들을 필터링한 후, 맨 마지막 조건으로 함수를 호출하는 것이 바람직합니다.
 * 왜냐하면 많은 양의 데이터가 존재할 경우 현재 페이지가 비교적 최근 페이지라면,
 * 이 함수를 먼저 호출하게되면 id보다 작은 조건에 부합하는 모든 데이터가 먼저 필터링 되기 때문에 전혀 효율적이지 않습니다.
 * 예제1(단일 조건일 경우) : where: lastIdCondition
 * 예제2(다중 조건일 경우) : where: { AND: [{ 컬럼: 매개변수 }, lastIdCondition], },
 */
function ltLastIdCondition(lastId) {
    if (lastId <= BigInt(0)) {
        return {};
    }
    return { id: { lt: lastId } };
}
exports.ltLastIdCondition = ltLastIdCondition;
/**
 *
 * @param foundDatas
 * @returns 0 or lastId in found data
 * <ENG>
 * This function finds and returns the lastId among the currently searched data.
 * The result value of this function is used to insert the last id into the paging metadata.
 * It is not mandatory to use this function, but you can use it if you want to insert the last id of the data you currently inquired into the metadata.
 * If an empty array comes in as a parameter, return 0 as the last id.
 * You can put any type of data as a parameter, which means it can be used in any domain.
 * ex : metadata: { lastId: findLastIdOrDefault(posts) },
 */
/**
 *
 * @param foundDatas
 * @returns 0 or lastId in found data
 * <KOR>
 * 이 함수는 현재 조회한 데이터 중 lastId를 찾아서 리턴하는 함수입니다.
 * 이 함수의 결과값은 페이징 meta data에 last id를 삽입하는데 사용됩니다.
 * 이 함수를 사용하는 것은 필수는 아니나, 현재 조회한 데이터 중 last id를 meta data에 삽입하고 싶은 경우 사용하면 됩니다.
 * 만약 빈 배열이 매개변수로 들어왔다면 last id로 0을 리턴합니다.
 * 매개변수로는 어떤 타입의 데이터라도 넣을 수 있습니다. 즉 모든 도메인에서 사용가능합니다.
 * 예제 : metadata: { lastId: findLastIdOrDefault(posts) },
 */
function findLastIdOrDefault(foundDatas) {
    const length = foundDatas.length;
    if (length === 0) {
        return 0;
    }
    const lastIndex = length - 1;
    const lastData = foundDatas[lastIndex];
    return lastData.id;
}
exports.findLastIdOrDefault = findLastIdOrDefault;
//# sourceMappingURL=index.js.map