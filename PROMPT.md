Implement the full **Letter management logic** for the _DearYou_ backend inside a `Cursor` workspace. Begin with the **core service layer** and include **supporting files** as needed.

### Features to implement in `services/letter.service.ts`:

- **Create Letter**
  - Accept `title` (optional), `content` (rich-text JSON), and `isPublic` (boolean)
  - Generate a **unique slug** using `nanoid`
  - Use **UUIDv7** for the letter ID
- **Get Letter**
  - **Public**: Fetch by `slug` if `isPublic === true`
  - **Authenticated**: Fetch own letter by `id`
- **Update Letter**
  - Only allow owner to update `title`, `content`, or `isPublic`
- **Delete Letter**
  - Only allow owner to delete their own letter
- **List My Letters**
  - Return a paginated list of letters owned by the authenticated user

### Implementation Requirements:

- Input validation with **Zod**
- DB interaction via **Prisma** (model: `Letter`, linked to `User`)
- Use `types/letter.types.ts` to define reusable types/interfaces
- Use `validations/letter.validation.ts` to centralize all input schemas
- Add any helper utilities or auth ownership logic needed to keep services clean

### Output Format:

Write the following files fully:

1. `services/letter.service.ts`
2. `types/letter.types.ts`
3. `validations/letter.validation.ts`
4. Any **helper functions** if required

Keep the code organized, typed, and easy to connect to controllers later.
