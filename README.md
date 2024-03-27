# prisma-no-offset

> Supports both no-offset paging for ascending and descending order.

#### Notice

Built for developers using prisma and nestjs. However, even without using nestjs, examples can be applied to most backend/full stack frameworks.

## Contents

- [prisma-no-offset](#prisma-no-offset) - [notice](#notice)
  - [Contents](#contents)
  - [Why I made this?](#why-i-made-this)
  - [intro](#intro)
  - [docs: ENG](#docs-eng)
    - [Bigint to string in Json serialization](#bigint-to-string-in-json-serialization)
    - [ltLastIdCondition - less than last id filtering fuction](#ltlastidcondition---less-than-last-id-filtering-fuction)
    - [gtLastIdCondition - greater than last id filtering fuction](#gtlastidcondition---greater-than-last-id-filtering-fuction)
    - [findLastIdOrDefault - find last id in found data](#findlastidordefault---find-last-id-in-found-data)
  - [docs: KOR](#docs-kor)
    - [Bigint json 직렬화시 string으로 캐스팅 코드](#bigint-json-직렬화시-string으로-캐스팅-코드)
    - [ltLastIdCondition - last id보다 작은 id 필터링 함수](#ltlastidcondition---last-id보다-작은-id-필터링-함수)
    - [gtLastIdCondition - last id보다 큰 id 필터링 함수](#gtlastidcondition---last-id보다-큰-id-필터링-함수)
    - [findLastIdOrDefault - 조회한 데이터에서 last id를 찾는 함수](#findlastidordefault---조회한-데이터에서-last-id를-찾는-함수)
  - [Example - ENG](#example---eng)
    - [Dto](#dto)
    - [Repository](#repository)
    - [Service](#service)
    - [Controller](#controller)
  - [Example - KOR](#example---kor)
    - [Dto](#dto-1)
    - [Repository](#repository-1)
    - [Service](#service-1)
    - [Controller](#controller-1)

## Why I made this?

- Prisma has the grammar of `cursor`, but you have to use the code `skip: 1` together to use it.
- But this code skips the first data even when there is no lastId,
- So `skip: lastId ? 1 : 0, ...(lastId && {cursor: { id: lastId }})`
- it will work normally only when these codes are added.
- Because of this inconvenience, a library was created to allow simple curser-based paging.

```typescript
//before - prisma provides
findMany({
  take: 10,
  skip: lastId ? 1 : 0,
  ...(lastId && { cursor: { id: lastId } }),
});

//after - use prisma-no-offset
findMany({
  where: ltLastIdCondition(lastId),
  take: 10,
});
```

## intro

- This package is a utility package that helps you conveniently use no-offset paging(called cursor based, infinite scroll or keyset pagination) when using prisma orm.
- The package contains a lastId constant to be used as a query string and a default value constant for lastId,
- a conditional query function(usually called ltLastId) that filters data with an id less than the last id in descending order,
- a conditional query function(usally called gtLastId) that filters data with an id greater than the last id in ascending order,
- a function that extracts the last id from the current query data,
- and a code that casts it as a string type when the bigint type is serialized as json.
- Because of the bigint type, the package will be available starting in es2020.
- If you check the actual code in index.ts, you can see the same annotation as the document.
- If you are using ascending sort, look at the `gtLastIdCondition` document.
- If you are using descending sort, look at the `ltLastIdCondition` document.
- 이 패키지는 prisma orm에서 편리하게 no-offset 페이징(무한 스크롤, 커서 기반 페이징이라 불리기도 한다)을 사용할 수 있도록 도와주는 유틸 패키지입니다.
- 이 패키지는 쿼리스트링으로 사용될 lastId 상수와 lastId의 기본값 상수,
- 내림차순 정렬에서 사용되는 last id보다 작은 id를 가진 데이터를 필터링하는 조건절 쿼리 함수와
- 오름차순 정렬에서 사용되는 last id보다 큰 id를 가진 데이터를 필터링 하는 조건절 쿼리 함수와
- 조회한 데이터에서 last id를 추출하는 함수,
- 마지막으로 bigint타입이 json으로 직렬화 될 때, 문자타입(string)으로 자동 캐스팅 시켜주는 코드가 들어있습니다.
- bigint타입 때문에 es2020부터 해당 패키지를 사용하실 수 있습니다.
- index.ts 파일의 실제코드를 확인하시면 문서와 똑같은 주석을 확인하실 수 있습니다.

## docs: ENG

### Bigint to string in Json serialization

- This code requires definition only.
- When converted to json, it is cast and returned as a string.

### ltLastIdCondition - less than last id filtering fuction

- **You must use this function when sorting data in descending order.**
- This function is a utility function used to create a clause in the no offset paging based on the descending order of id.
- The id must be set to the bigint type.
- Returns an empty query if the lastId is null, 0 or less than 0(less than & euqal == lte). prisma ignores this empty query.
- If a normal lastId comes in, this function looks for id less than lastId.
- When you use this utility function in a single condition, you just need to call the function.
- However, when using multiple conditions, it is desirable to filter the necessary conditions and then call the function as the last condition.
- Because if there's a lot of data in the database and the current page is a relatively recent page,
- Calling this function first is not at all efficient because all data that meet conditions less than id are filtered first.

```typescript
//single condition
where: ltLastIdCondition(lastId)

//multiple condition
where: { AND: [{ column: agrs }, ltLastIdCondition(lastId)], },
```

### gtLastIdCondition - greater than last id filtering fuction

- **You must use this function when sorting data in ascending order.**
- This function is a utility function used to create a clause in the no offset paging based on the ascending order of id.
- The id must be set to the bigint type.
- Returns an empty query if the lastId is null, 0 or less than 0(less than & euqal == lte). prisma ignores this empty query.
- If a normal lastId comes in, this function looks for id less than lastId.
- When you use this utility function in a single condition, you just need to call the function.
- However, when using multiple conditions, it is desirable to filter the necessary conditions and then call the function as the last condition.
- Because if there's a lot of data in the database and the current page is a relatively recent page,
- Calling this function first is not at all efficient because all data that meet conditions greater than id are filtered first.

```typescript
//single condition
where: gtLastIdCondition(lastId)

//multiple condition
where: { AND: [{ column: agrs }, gtLastIdCondition(lastId)], },
```

### findLastIdOrDefault - find last id in found data

- This function finds and returns the lastId among the currently searched data.
- The result value of this function is used to insert the last id into the paging metadata.
- It is not mandatory to use this function, but you can use it if you want to insert the last id of the data you currently inquired into the metadata.
- If an empty array comes in as a parameter, return 0 as the last id.
- You can put any type of data as a parameter, which means it can be used in any domain.

```typescript
metadata: { lastId: findLastIdOrDefault(posts) },
```

## docs: KOR

### Bigint json 직렬화시 string으로 캐스팅 코드

- 이 코드는 정의만 필요로 합니다. 직접 사용할 일은 없을 겁니다.
- json으로 직렬화 시 문자열로 캐스팅되어 리턴합니다. 클라이언트에게 bigint타입을 리턴시 string으로 리턴됩니다.

### ltLastIdCondition - last id보다 작은 id 필터링 함수

- **내림차순 정렬을 사용하고 있다면 반드시 이 함수를 사용해야합니다.**
- 이 함수는 id 내림차순 기반의 No offset 페이징의 where절을 만드는데 사용하는 유틸함수입니다.
- id는 반드시 bigint 타입으로 구성해야합니다.
- lastId가 null, 0 혹은 0보다 작을경우 빈 쿼리를 리턴합니다. prisma는 이 빈쿼리를 무시합니다.
- 정상적인 lastId가 들어온다면, lastId 보다 작은 id를 기준으로 찾도록 합니다.
- 이 유틸함수를 단일 조건에서 사용할 때는 큰 문제없이 함수를 호출하면됩니다.
- 그러나 여러 조건에서 사용할 때에는 필요한 조건들을 필터링한 후, 맨 마지막 조건으로 함수를 호출하는 것이 바람직합니다.
- 왜냐하면 많은 양의 데이터가 존재할 경우 현재 페이지가 비교적 최근 페이지라면,
- 이 함수를 먼저 호출하게되면 id보다 작은 조건에 부합하는 모든 데이터가 먼저 필터링 되기 때문에 전혀 효율적이지 않습니다.

```typescript
//단일 조건
where: ltLastIdCondition(lastId)

//다중 조건
where: { AND: [{ column: agrs }, ltLastIdCondition(lastId)], },
```

### gtLastIdCondition - last id보다 큰 id 필터링 함수

- **오름차순 정렬을 사용하고 있다면 반드시 이 함수를 사용해야합니다.**
- 이 함수는 id 오름차순 기반의 No offset 페이징의 where절을 만드는데 사용하는 유틸함수입니다.
- id는 반드시 bigint 타입으로 구성해야합니다.
- lastId가 null, 0 혹은 0보다 작을경우 빈 쿼리를 리턴합니다. prisma는 이 빈쿼리를 무시합니다.
- 정상적인 lastId가 들어온다면, lastId 보다 큰 id를 기준으로 찾도록 합니다.
- 이 유틸함수를 단일 조건에서 사용할 때는 큰 문제없이 함수를 호출하면됩니다.
- 그러나 여러 조건에서 사용할 때에는 필요한 조건들을 필터링한 후, 맨 마지막 조건으로 함수를 호출하는 것이 바람직합니다.
- 왜냐하면 많은 양의 데이터가 존재할 경우 현재 페이지가 비교적 최근 페이지라면,
- 이 함수를 먼저 호출하게되면 id보다 큰 조건에 부합하는 모든 데이터가 먼저 필터링 되기 때문에 전혀 효율적이지 않습니다.

```typescript
//단일 조건
where: gtLastIdCondition(lastId)

//다중 조건
where: { AND: [{ column: agrs }, gtLastIdCondition(lastId)], },
```

### findLastIdOrDefault - 조회한 데이터에서 last id를 찾는 함수

- 이 함수는 현재 조회한 데이터 중 lastId를 찾아서 리턴하는 함수입니다.
- 이 함수의 결과값은 페이징 meta data에 last id를 삽입하는데 사용됩니다.
- 이 함수를 사용하는 것은 필수는 아니나, 현재 조회한 데이터 중 last id를 meta data에 삽입하고 싶은 경우 사용하면 됩니다.
- 만약 빈 배열이 매개변수로 들어왔다면 last id로 0을 리턴합니다.
- 매개변수로는 어떤 타입의 데이터라도 넣을 수 있습니다. 즉 모든 도메인에서 사용가능합니다.

```typescript
metadata: { lastId: findLastIdOrDefault(posts) },
```

## Example - ENG

### Dto

- Please make and use the return dto yourself.

```typescript
//PostPage.ts
export interface PostPage {
  readonly id: bigint;
  readonly title: string;
  readonly writer_id: string;
  readonly created_date: Date;
}

//PostOptimizedPageDto.ts
export interface PostOptimizedPageDto {
  readonly postPages: PostPage[];
  readonly metadata: {
    readonly lastId: bigint;
  };
}
```

### Repository

- Single Condition & descending order

```typescript
async findAllOptimizedPostPage(
    lastId: bigint,
): Promise<PostOptimizedPageDto> {
    //call ltLastIdCondition function
    const lastIdCondition = ltLastIdCondition(lastId);
    const posts: PostPage[] = await this.prisma.post.findMany({
      where: lastIdCondition,
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'desc' },
      take: PostRepoConstant.PAGE_SIZE, //The limit page size must be specified. PostRepoConstant.PAGE_SIZE = 10
    });
    return {
      postPages: posts,
      //I inserted the last id in the metadata.
      metadata: { lastId: findLastIdOrDefault(posts) },
    };
}
```

- Multiple Condition & descending order

```typescript
async findOptimizedPostPageByWriterId(
    writerId: string,
    lastId: bigint,
): Promise<PostOptimizedPageDto> {
    const lastIdCondition = ltLastIdCondition(lastId);
    const posts: PostPage[] = await this.prisma.post.findMany({
        //Multiple conditions use and queries.
        //As described in the description, ltLastId is most efficient to use as the last condition.
      where: {
        AND: [{ writer_id: writerId }, lastIdCondition],
      },
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'desc' },
      take: PostRepoConstant.PAGE_SIZE, //The limit page size must be specified. PostRepoConstant.PAGE_SIZE = 10
    });
    return {
      postPages: posts,
      //I inserted the last id in the metadata.
      metadata: { lastId: findLastIdOrDefault(posts) },
    };
}
```

- Single Condition & ascending order

```typescript
async findAllOptimizedPostPage(
    lastId: bigint,
): Promise<PostOptimizedPageDto> {
    //call gtLastIdCondition function
    const lastIdCondition = gtLastIdCondition(lastId);
    const posts: PostPage[] = await this.prisma.post.findMany({
      where: lastIdCondition,
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'asc' },
      take: PostRepoConstant.PAGE_SIZE, //The limit page size must be specified. PostRepoConstant.PAGE_SIZE = 10
    });
    return {
      postPages: posts,
      //I inserted the last id in the metadata.
      metadata: { lastId: findLastIdOrDefault(posts) },
    };
}
```

- Multiple Condition & ascending order

```typescript
async findOptimizedPostPageByWriterId(
    writerId: string,
    lastId: bigint,
): Promise<PostOptimizedPageDto> {
    const lastIdCondition = gtLastIdCondition(lastId);
    const posts: PostPage[] = await this.prisma.post.findMany({
        //Multiple conditions use and queries.
        //As described in the description, gtLastId is most efficient to use as the last condition.
      where: {
        AND: [{ writer_id: writerId }, lastIdCondition],
      },
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'asc' },
      take: PostRepoConstant.PAGE_SIZE, //The limit page size must be specified. PostRepoConstant.PAGE_SIZE = 10
    });
    return {
      postPages: posts,
      //I inserted the last id in the metadata.
      metadata: { lastId: findLastIdOrDefault(posts) },
    };
}
```

- In case you receive a query string optionally, it is also available in the optional query string.
- Same as usual, the only difference is to declare optional in the parameter.

```typescript
async findAllOptimizedPostPageOptionalQueryString(
    lastId?: bigint,
): Promise<PostOptimizedPageDto> {
    //call ltLastIdCondition function
    const lastIdCondition = ltLastIdCondition(lastId);
    const posts: PostPage[] = await this.prisma.post.findMany({
      where: lastIdCondition,
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'desc' },
      take: PostRepoConstant.PAGE_SIZE, //The limit page size must be specified. PostRepoConstant.PAGE_SIZE = 10
    });
    return {
      postPages: posts,
      //I inserted the last id in the metadata.
      metadata: { lastId: findLastIdOrDefault(posts) },
    };
}
```

### Service

```typescript
async getAllOptimizedPostPage(lastId: bigint) {
    return await this.postRepository.findAllOptimizedPostPage(lastId);
}

async getAllOptimizedPostPageWithOptionalQueryString(lastId?: bigint) {
    return await this.postRepository.findAllOptimizedPostPageOptionalQueryString(lastId);
}

async getOptimizedPostPageByWriterId(writerId: string, lastId: bigint) {
    return await this.postRepository.findOptimizedPostPageByWriterId(
      writerId,
      lastId,
    );
}
```

### Controller

- You must receive a query string named 'lastId'.
- For the first page, the client does not need to use lastId in the query string.
- Instead, set 0 as the default value for last id. In this package, last id=0 means the first page.
- In case the default value provided by the library is not used in the constant, but is entered as optional, it is a better code style to receive explicit parameters in case there is no value than receiving implicit parameters.

```typescript
@Get() // url : /posts
async allPosts(
    //LAST_ID = lastId
    //DEFAULT_LAST_ID = BigInt(0)
    @Query(LAST_ID) lastId: bigint = DEFAULT_LAST_ID,
) {
    return this.postService.getAllOptimizedPostPage(lastId);
}

//optional query string
@Get() // url : /posts-optional
async allPosts(
    //LAST_ID = lastId, that is optional value
    @Query(LAST_ID) lastId?: bigint,
) {
    return this.postService.getAllOptimizedPostPageOptionalQueryString(lastId);
}

@Get(PostUrl.BELONG_WRITER) // url : /posts/belong/writer
async myPosts(
    //PostControllerConstant.WRITER_ID = writerId
    @Query(PostControllerConstant.WRITER_ID) writerId: string,
    //LAST_ID = lastId
    //DEFAULT_LAST_ID = BigInt(0)
    @Query(LAST_ID) lastId: bigint = DEFAULT_LAST_ID,
) {
    return await this.postService.getOptimizedPostPageByWriterId(
      writerId,
      lastId,
    );
}
```

## Example - KOR

### Dto

- 본인이 직접 만든 dto를 사용하길 바랍니다.

```typescript
//PostPage.ts
export interface PostPage {
  readonly id: bigint;
  readonly title: string;
  readonly writer_id: string;
  readonly created_date: Date;
}

//PostOptimizedPageDto.ts
export interface PostOptimizedPageDto {
  readonly postPages: PostPage[];
  readonly metadata: {
    readonly lastId: bigint;
  };
}
```

### Repository

- 단일 조건 & 내림차순 정렬

```typescript
async findAllOptimizedPostPage(
    lastId: bigint,
): Promise<PostOptimizedPageDto> {
    //ltLastIdCondition 함수 호출
    const lastIdCondition = ltLastIdCondition(lastId);
    const posts: PostPage[] = await this.prisma.post.findMany({
      where: lastIdCondition,
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'desc' },
      take: PostRepoConstant.PAGE_SIZE, //리밋 페이지 사이즈는 기호에 맞게 반드시 정의하시기 바랍니다. PostRepoConstant.PAGE_SIZE = 10
    });
    return {
      postPages: posts,
      //필자의 경우 last id를 meta data에 삽입하였습니다.
      metadata: { lastId: findLastIdOrDefault(posts) },
    };
}
```

- 다중 조건 & 내림차순 정렬

```typescript
async findOptimizedPostPageByWriterId(
    writerId: string,
    lastId: bigint,
): Promise<PostOptimizedPageDto> {
    const lastIdCondition = ltLastIdCondition(lastId);
    const posts: PostPage[] = await this.prisma.post.findMany({
        //다중 조건에서는 and 쿼리를 이용합니다.
        //설명에서 기술했듯이 ltLastId는 맨 마지막 조건으로 사용하는 것이 가장 효율적입니다.
      where: {
        AND: [{ writer_id: writerId }, lastIdCondition],
      },
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'desc' },
      take: PostRepoConstant.PAGE_SIZE, //리밋 페이지 사이즈는 기호에 맞게 반드시 정의하시기 바랍니다. PostRepoConstant.PAGE_SIZE = 10
    });
    return {
      postPages: posts,
      //필자의 경우 last id를 meta data에 삽입하였습니다.
      metadata: { lastId: findLastIdOrDefault(posts) },
    };
}
```

- 단일 조건 & 오름차순 정렬

```typescript
async findAllOptimizedPostPage(
    lastId: bigint,
): Promise<PostOptimizedPageDto> {
    //gtLastIdCondition 함수 호출
    const lastIdCondition = gtLastIdCondition(lastId);
    const posts: PostPage[] = await this.prisma.post.findMany({
      where: lastIdCondition,
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'asc' },
      take: PostRepoConstant.PAGE_SIZE, //리밋 페이지 사이즈는 기호에 맞게 반드시 정의하시기 바랍니다. PostRepoConstant.PAGE_SIZE = 10
    });
    return {
      postPages: posts,
      //필자의 경우 last id를 meta data에 삽입하였습니다.
      metadata: { lastId: findLastIdOrDefault(posts) },
    };
}
```

- 다중 조건 & 오름차순 정렬

```typescript
async findOptimizedPostPageByWriterId(
    writerId: string,
    lastId: bigint,
): Promise<PostOptimizedPageDto> {
    const lastIdCondition = gtLastIdCondition(lastId);
    const posts: PostPage[] = await this.prisma.post.findMany({
        //다중 조건에서는 and 쿼리를 이용합니다.
        //설명에서 기술했듯이 gtLastId는 맨 마지막 조건으로 사용하는 것이 가장 효율적입니다.
      where: {
        AND: [{ writer_id: writerId }, lastIdCondition],
      },
      select: { id: true, title: true, writer_id: true, created_date: true },
      orderBy: { id: 'asc' },
      take: PostRepoConstant.PAGE_SIZE, //리밋 페이지 사이즈는 기호에 맞게 반드시 정의하시기 바랍니다. PostRepoConstant.PAGE_SIZE = 10
    });
    return {
      postPages: posts,
      //필자의 경우 last id를 meta data에 삽입하였습니다.
      metadata: { lastId: findLastIdOrDefault(posts) },
    };
}
```

- optional 파라미터를 허용합니다. optional의 경우 `?`만 붙여주면 optional로 사용할 수 있습니다.

### Service

```typescript
async getAllOptimizedPostPage(lastId: bigint) {
    return await this.postRepository.findAllOptimizedPostPage(lastId);
}

async getOptimizedPostPageByWriterId(writerId: string, lastId: bigint) {
    return await this.postRepository.findOptimizedPostPageByWriterId(
      writerId,
      lastId,
    );
}
```

### Controller

- lastId 쿼리스트링을 반드시 받아야합니다.
- 첫번째 페이지의 경우 클라이언트는 lastId를 쿼리스트링에 사용하지 않아도 됩니다.
- 대신 last id의 기본값으로 0을 설정해줍니다. 이 패키지에서 last id=0의 의미는 첫번째 페이지라는 의미를 지닙니다.
- 라이브러리에서 제공하는 상수를 사용하지 않고, optional 쿼리 스트링을 입력받을 수 있습니다.
- 그러나 암묵적인 매개변수보다는 명시적인 default value를 선언하는 것이 보다 좋은 코드 스타일입니다.
- 따라서 라이브러리에서는 optional 쿼리스트링 보다는 명시적인 default value를 추천합니다.

```typescript
@Get() // url : /posts
async allPosts(
    //LAST_ID = lastId
    //DEFAULT_LAST_ID = BigInt(0)
    @Query(LAST_ID) lastId: bigint = DEFAULT_LAST_ID,
) {
    return this.postService.getAllOptimizedPostPage(lastId);
}

//optional 쿼리 스트링 사용 예제
async allPosts(
    //LAST_ID = lastId
    @Query(LAST_ID) lastId?: bigint
) {
    return this.postService.getAllOptimizedPostPageOptionalQueryString(lastId);
}

@Get(PostUrl.BELONG_WRITER) // url : /posts/belong/writer
async myPosts(
    //PostControllerConstant.WRITER_ID = writerId
    @Query(PostControllerConstant.WRITER_ID) writerId: string,
    //LAST_ID = lastId
    //DEFAULT_LAST_ID = BigInt(0)
    @Query(LAST_ID) lastId: bigint = DEFAULT_LAST_ID,
) {
    return await this.postService.getOptimizedPostPageByWriterId(
      writerId,
      lastId,
    );
}
```
