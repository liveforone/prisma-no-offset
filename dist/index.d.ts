/**
 * <ENG>
 * The two constants below are the lastId constant and the default constant of lastId that will be used as the query string in the controller.
 * You don't need to define a constant directly, you can use the constant defined below.
 * Because you specified the default, for the first page,
 * the default is automatically inserted without the client specifying the lastId query string, enabling normal no-offset paging.
 * ex) : @Query(LAST_ID) lastId: bigint = DEFAULT_LAST_ID
 */
/**
 * <KOR>
 * 아래의 두 상수는 controller에서 쿼리 스트링으로 사용될 lastId 상수와 lastId의 기본값 상수입니다.
 * 상수를 직접 정의할 필요없이, 아래에 정의된 상수를 사용하시면 됩니다.
 * 기본값을 지정했기 때문에 첫번째 페이지의 경우,
 * 클라이언트가 lastId 쿼리스트링을 지정하지 않아도 자동으로 기본값이 삽입되어 정상적인 no-offset 페이징이 가능해집니다.
 * ex) : @Query(LAST_ID) lastId: bigint = DEFAULT_LAST_ID
 */
declare const LAST_ID = "lastId";
declare const DEFAULT_LAST_ID: bigint;
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
declare function ltLastIdCondition(lastId: bigint): {
    id?: undefined;
} | {
    id: {
        lt: bigint;
    };
};
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
declare function findLastIdOrDefault(foundDatas: any[]): any;
export { LAST_ID, DEFAULT_LAST_ID, ltLastIdCondition, findLastIdOrDefault };