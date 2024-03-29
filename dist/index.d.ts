/**
 * The two constants below are the lastId constant and the default constant of lastId that will be used as the query string in the controller.
 * You don't need to define a constant directly, you can use the constant defined below.
 * Because you specified the default, for the first page,
 * the default is automatically inserted without the client specifying the lastId query string, enabling normal no-offset paging.
 * ex) : @Query(LAST_ID) lastId: bigint = DEFAULT_LAST_ID
 */
declare const LAST_ID = "lastId";
declare const DEFAULT_LAST_ID: bigint;
/**
 *
 * You must use this function when sorting data in descending order.
 * This function is a utility function used to create a clause in the no offset paging based on the descending order of id.
 * The id must be set to the bigint type.
 * Returns an empty query if the lastId is 0 or less than 0(less than & euqal == lte). prisma ignores this empty query.
 * If a normal lastId comes in, this function looks for id less than lastId.
 * When you use this utility function in a single condition, you just need to call the function.
 * However, when using multiple conditions, it is desirable to filter the necessary conditions and then call the function as the last condition.
 * Because if there's a lot of data in the database and the current page is a relatively recent page,
 * Calling this function first is not at all efficient because all data that meet conditions less than id are filtered first.
 * ex1(single condition) : where: ltLastIdCondition(lastId)
 * ex2(multiple condition) : where: { AND: [{ column: agrs }, ltLastIdCondition(lastid)], },
 */
declare function ltLastIdCondition(lastId: bigint | null): {
    id: {
        lt: bigint;
    };
} | {
    id?: undefined;
};
/**
 *
 * You must use this function when sorting data in ascending order.
 * This function is a utility function used to create a clause in the no offset paging based on the ascending order of id.
 * The id must be set to the bigint type.
 * Returns an empty query if the lastId is 0 or less than 0(less than & euqal == lte). prisma ignores this empty query.
 * If a normal lastId comes in, this function looks for id less than lastId.
 * When you use this utility function in a single condition, you just need to call the function.
 * However, when using multiple conditions, it is desirable to filter the necessary conditions and then call the function as the last condition.
 * Because if there's a lot of data in the database and the current page is a relatively recent page,
 * Calling this function first is not at all efficient because all data that meet conditions greater than id are filtered first.
 */
declare function gtLastIdCondition(lastId: bigint | null): {
    id: {
        gt: bigint;
    };
} | {
    id?: undefined;
};
/**
 *
 * This function finds and returns the lastId among the currently searched data.
 * The result value of this function is used to insert the last id into the paging metadata.
 * It is not mandatory to use this function, but you can use it if you want to insert the last id of the data you currently inquired into the metadata.
 * If an empty array comes in as a parameter, return 0 as the last id.
 * You can put any type of data as a parameter, which means it can be used in any domain.
 * ex : metadata: { lastId: findLastIdOrDefault(posts) },
 */
declare function findLastIdOrDefault(foundDatas: any[]): any;
export { LAST_ID, DEFAULT_LAST_ID, ltLastIdCondition, gtLastIdCondition, findLastIdOrDefault, };
