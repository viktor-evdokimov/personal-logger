// @flow

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../constants';
import {
  DateIcon,
  DrinkIcon,
  FoodIcon,
  TimeIcon,
} from '../components/SvgIcons';
import { getDate, getDateString, getTimeString } from '../utils';

import type { Food } from '../types';

type Props = {
  deleteFn?: () => Promise<void>,
  saveFn: (Food: Food) => Promise<void>,
  food: Food,
};

type State = {
  date: string,
  isSaving: boolean,
  food: Food,
  time: string,
};

export default class NewFoodDrink extends Component<Props, State> {
  state: State = {
    date: getDateString(this.props.food.date),
    food: { ...this.props.food }, // Shallow clone for editing
    isSaving: false,
    time: getTimeString(this.props.food.date),
  };

  render() {
    const { deleteFn } = this.props;
    const { date, food, isSaving, time } = this.state;

    return (
      <form className="new-form" disabled={isSaving} onSubmit={this._onSubmit}>
        <section className="new-form-section">
          <div className="new-form-section-header">
            <DateIcon className="new-form-section-header-svg" />
            <input
              className="new-form-date-time-input"
              disabled={isSaving}
              name="date"
              onChange={this._onDateChange}
              type="date"
              value={date}
            />
          </div>
          <div className="new-form-section-header">
            <TimeIcon className="new-form-section-header-svg" />
            <input
              className="new-form-date-time-input"
              disabled={isSaving}
              name="time"
              onChange={this._onTimeChange}
              type="time"
              value={time}
            />
          </div>
        </section>
        <section className="new-form-section">
          <div className="new-form-section-header new-form-section-header-types">
            <label className="new-form-rating-radio-label">
              <small>Food</small>
              <FoodIcon
                className={`new-form-type-svg ${
                  food.type === 'food' ? 'new-form-type-svg-active' : ''
                }`}
              />
              <input
                checked={food.type === 'food'}
                disabled={isSaving}
                name="type"
                onChange={this._onTypeChange}
                type="radio"
                value="food"
              />
            </label>
            <label className="new-form-rating-radio-label">
              <small>Drink</small>
              <DrinkIcon
                className={`new-form-type-svg ${
                  food.type === 'drink' ? 'new-form-type-svg-active' : ''
                }`}
              />
              <input
                checked={food.type === 'drink'}
                disabled={isSaving}
                name="type"
                onChange={this._onTypeChange}
                type="radio"
                value="drink"
              />
            </label>
          </div>
        </section>
        <section className="new-form-section">
          <input
            className="new-form-input"
            disabled={isSaving}
            name="title"
            onChange={this._onTitleChange}
            placeholder="What did you eat/drink?"
            type="text"
            value={food.title}
          />
        </section>
        <section className="new-form-section">
          <div className="new-form-section-header">
            <label>Ingredients:</label>
            <input
              className="new-form-add-ingredient-button"
              disabled={isSaving}
              onClick={this._addIngredient}
              type="button"
              value="+ add"
            />
          </div>
          {food.ingredients.map((ingredient, index) => (
            <input
              className="new-form-input"
              disabled={isSaving}
              key={index}
              onChange={event =>
                this._onIngredientChange(index, event.currentTarget.value)
              }
              type="text"
              value={ingredient}
            />
          ))}
        </section>
        <section className="new-form-section">
          <textarea
            className="new-form-textarea"
            disabled={isSaving}
            onChange={this._onNotesChange}
            placeholder="Notes (optional)"
            value={food.notes}
          />
        </section>
        <section className="new-form-section">
          <button
            className="new-form-save-button"
            disabled={isSaving || !food.title}
          >
            Save
          </button>
        </section>
        {!!deleteFn && (
          <section className="new-form-section">
            <button
              className="new-form-delete-button"
              disabled={isSaving}
              onClick={this._onDelete}
            >
              Delete
            </button>
          </section>
        )}
        <section className="new-form-section">
          <NavLink to={ROUTES.foods.list}>
            <button className="new-form-cancel-button" disabled={isSaving}>
              Cancel
            </button>
          </NavLink>
        </section>
      </form>
    );
  }

  _addIngredient = () => {
    this.setState(state => ({
      food: {
        ...state.food,
        ingredients: [...state.food.ingredients, ''],
      },
    }));
  };

  _onDateChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      date: event.currentTarget.value,
    });
  };

  _onDelete = (event: Event) => {
    event.preventDefault();

    this.setState(
      {
        isSaving: true,
      },
      this.props.deleteFn
    );
  };

  _onIngredientChange = (index: number, value: string) => {
    this.setState(state => {
      const ingredients = [...state.food.ingredients];
      ingredients[index] = value;

      return {
        food: {
          ...state.food,
          ingredients,
        },
      };
    });
  };

  _onNotesChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const notes = event.currentTarget.value;
    this.setState(state => ({
      food: {
        ...state.food,
        notes,
      },
    }));
  };

  _onSubmit = (event: Event) => {
    event.preventDefault();

    const { saveFn } = this.props;
    const { date, food, time } = this.state;

    food.date = getDate(date, time);
    food.ingredients = food.ingredients.filter(Boolean);

    this.setState(
      {
        isSaving: true,
      },
      async () => {
        await saveFn(food);

        window.location.replace(ROUTES.foods.list);
      }
    );
  };

  _onTimeChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      time: event.currentTarget.value,
    });
  };

  _onTitleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const title = event.currentTarget.value;
    this.setState(state => ({
      food: {
        ...state.food,
        title,
      },
    }));
  };

  _onTypeChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const type = event.currentTarget.value;
    this.setState(state => ({
      food: {
        ...state.food,
        type,
      },
    }));
  };
}
