import { Action } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListAction from "./shopping-list.actions";

const initialState = {
  ingredients: [new Ingredient("Apples", 5), new Ingredient("Tomatoes", 10)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};
export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}
export interface AppState {
  shoppingList: State;
}

export function shoppingListReducer(
  state: State = initialState,
  action: ShoppingListAction.ShoppingListActions
) {
  switch (action.type) {
    case ShoppingListAction.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload],
      };
    case ShoppingListAction.ADD_INGREDIENTS:
      if (Array.isArray(action.payload)) {
        return {
          ...state,
          ingredients: [...state.ingredients, ...action.payload],
        };
      } else {
        return {
          ...state,
          ingredients: [...state.ingredients, action.payload],
        };
      }
    case ShoppingListAction.UPDATE_INGREDIENT:
      // state.ingredients[action.payload.index] = action.payload.ingredient;
      const ingredient = state.ingredients[action.payload.index];
      const updatedIngredient = {
        ...ingredient,
        ...action.payload.ingredient,
      };
      const updatedIngredients = [...state.ingredients];
      updatedIngredient[action.payload.index] = updatedIngredient;
      return {
        ...state,
        ingredient: updatedIngredients,
      };
    case ShoppingListAction.DELETE_INGREDIENT:
      return {
        ...state,
        ingredient: state.ingredients.filter((ig, igIndex) => {
          return igIndex !== action.payload.index;
        }),
      };
    default:
      return state;
  }
}
