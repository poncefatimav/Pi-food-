import React from "react";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cleanRecipes,
  getDietsTypes,
  getRecipes,
  postRecipe,
  setPage,
} from "../../actions/index";
import styles from "./CreateRecipe.module.css";
import NavBarHome from "../NavBarHome/NavBarHome";

export default function CreateRecipe() {
  const dispatch = useDispatch();
  const history = useHistory();
  let allRecipes = useSelector((state) => state.allRecipes);
  const dietsTypes = useSelector((state) => state.diets);

  const [errors, setErrors] = useState({});

  const [input, setInput] = useState({
    name: "",
    summary: "",
    healthScore: "",
    steps: [],
    image: "",
    diets: [],
  });

  useEffect(() => {
    dispatch(getDietsTypes());
  }, [dispatch]);

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
    setErrors(
      validate({
        ...input,
        [e.target.name]: e.target.value,
      })
    );
  };

  const handleSelect = (e) => {
    setInput({
      ...input,
      diets: [...new Set([...input.diets, e.target.value])],
    });
    setErrors(
      validate({
        ...input,
        [e.target.name]: e.target.value,
      })
    );
  };

  const handleSteps = (e) => {
    setInput({
      ...input,
      steps: [{ step: e.target.value }],
    });
    setErrors(
      validate({
        ...input,
        [e.target.name]: e.target.value,
      })
    );
  };

  let validateUrl = /(http(s?):)([/|.|\w|\s|-])*.(?:jpg|gif|png)/;

  function validate(input) {
    let errors = {};

    if (!input.name.trim()) {
      errors.name = "Ingresa un nombre correcto";
    } else if (
      allRecipes.find(
        (e) =>
          e.name.toLowerCase().trim() === input.name.toLocaleLowerCase().trim()
      )
    ) {
      errors.name = `La receta ${input.name} ya existe`;
    } else if (input.summary.length < 40 || input.summary.trim() === "") {
      errors.summary = "Ingresa un correcto summary";
    } else if (
      input.healthScore === "" ||
      input.healthScore < 1 ||
      input.healthScore > 100
    ) {
      errors.healthScore = "Ingresa healthScore";
    } else if (input.steps.length === 0) {
      errors.steps = "Ingresa los pasos correctos";
    } else if (!input.image || !validateUrl.test(input.image)) {
      errors.image = "No es un URL valido";
    } else if (input.diets.length === 0) {
      errors.diets = "Selecciona una o más dietas";
    }
    return errors;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validate(input));
    let error = validate(input);

    if (Object.values(error).length !== 0) {
    } else {
      dispatch(postRecipe(input));
      alert("La nueva receta fue creada");
      setInput({
        name: "",
        summary: "",
        healthScore: "",
        steps: [],
        image: "",
        diets: [],
      });
      history.push("/home");
      dispatch(cleanRecipes());
      dispatch(getRecipes());
      dispatch(setPage(1));
    }
  };

  return (
    <div id={styles.createRecipe}>
      <NavBarHome />
      <div id={styles.divContainer}>
        <form id={styles.form} onSubmit={(e) => handleSubmit(e)}>
          <div id={styles.divH1}>
            <h1 id={styles.h1}>Crea tu receta!</h1>
          </div>
          <div>
            <label id={styles.label}>Nombre: </label>
            <input
              id={styles.input}
              type="text"
              value={input.name}
              name="name"
              onChange={(e) => handleChange(e)}
            />
            {errors.name && <h4 id={styles.error}>{errors.name}</h4>}
          </div>
          <div>
            <label id={styles.label}>Summary: </label>
            <textarea
              id={styles.input}
              type="text"
              value={input.summary}
              name="summary"
              onChange={(e) => handleChange(e)}
            ></textarea>
            {errors.summary && <h4 id={styles.error}>{errors.summary}</h4>}
          </div>
          <div>
            <label id={styles.label}>Health Score: </label>
            <input
              id={styles.input}
              type="number"
              value={input.healthScore}
              name="healthScore"
              onChange={(e) => handleChange(e)}
            />
            {errors.healthScore && (
              <h4 id={styles.error}>{errors.healthScore}</h4>
            )}
          </div>
          <div>
            <label id={styles.label}>Pasos: </label>
            <textarea
              id={styles.input}
              type="text"
              value={input.steps.step}
              name="steps"
              onChange={(e) => handleSteps(e)}
            ></textarea>
            {errors.steps && <h4 id={styles.error}>{errors.steps}</h4>}
          </div>
          <div>
            <label id={styles.label}>Imagen: </label>
            <input
              id={styles.input}
              type="text"
              value={input.image}
              name="image"
              onChange={(e) => handleChange(e)}
            ></input>
            {errors.image && <h4 id={styles.error}>{errors.image}</h4>}
          </div>
          <div>
            <label id={styles.label}>Dietas: </label>
            <select
              id={styles.selectForm}
              onChange={(e) => handleSelect(e)}
              defaultValue="default"
            >
              <option disabled value="default">
                {" "}
                Selecciona diet...
              </option>
              {dietsTypes?.map((d) => (
                <option value={d.name} key={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <div id={styles.divDiet}>
              {input.diets.map((d) => (
                <div key={d}>
                  <div>
                    <h4 id={styles.selectDiet}>{d}</h4>
                  </div>
                  <button id={styles.buttonDiet} value={d}>
                    x
                  </button>
                </div>
              ))}
            </div>
            {errors.diets && <h4 id={styles.error}>{errors.diets}</h4>}
          </div>
          <button id={styles.buttonForm} type="submit">
            Crea la receta
          </button>
        </form>
      </div>
    </div>
  );
}
