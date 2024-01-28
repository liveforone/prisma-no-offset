# prisma-no-offset

## intro

- This package is a condition function of ltLastId (a function that filters the id with the id less than the last id) that will be entered into the condition in no-offset-based paging.
- It will work from the es2020 version.
- 이 패키지는 no-offset 기반의 페이징에서, where 조건에 들어갈 ltLastId(=last id 보다 id가 작은 id를 필터링하는 함수)를 condition 함수이다.
- es2020 버전부터 동작한다.

## docs: ENG

- This function queries only data with an id smaller than the last id (=lt).
- It is a prisma where condition utilization function.
- When receiving the lastId from the controller, it is received as zero as the dipold value.
- Because the lastId parameter enters null on the first page, the default value must be set to 0.
- Assuming this, the following utilization function must be used to run normally.
- Also, in the case of condition, you can just use it when you go into a hole in a section,
- If multiple conditions are included in the where section, AND conditions should be hung and used.
- ex) : where: { AND: [{ column: val }, lastIdCondition] },

## docs: KOR

- 이 함수는 last id보다 작은(=lt) id를 가진 데이터만 조회하는
- prisma where condition 유틸 함수이다.
- 컨트롤러에서 lastId를 받을때, 디폴드 값으로 0으로 받는다.
- 첫번째 페이지는 lastId 파라미터가 null로 들어오기 때문에, 디폴트 값을 0으로 설정해야하기 때문이다.
- 이것을 가정하에 아래 유틸 함수를 사용해야 정상적으로 실행된다.
- 또한 condition의 경우 where절에 홀로 들어갈땐 그냥 사용해도 무방하지만,
- where절에 여러 조건이 들어갈경우 AND 조건을 걸어서 사용해야한다.
- ex) : where: { AND: [{ column: val }, lastIdCondition] },

## example

- single condition

```typescript
where: { lastIdCondition },
```

- multiple condition

```typescript
where: { AND: [{ column: val }, lastIdCondition] },
```
