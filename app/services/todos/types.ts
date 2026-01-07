// Todos Types

/**
 * Data structure representing a Todo item
 */
export type Todo = {
  $id: string;
  title: string;
  completed: boolean;
  userId: string;
  parentId?: string;
  children?: Todo[];
};
