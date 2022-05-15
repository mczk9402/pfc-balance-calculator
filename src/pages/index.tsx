import type { NextPage } from "next";
import Head from "next/head";
import { NumberInput, Text, Input, Button } from "@mantine/core";
import React, { useEffect, useState } from "react";

type MealList = {
  title: string;
  pfcList: {
    title: string;
    grams: number;
  }[];
}[];

const inputList = ["タンパク質", "脂質", "炭水化物（糖質）"];

const initialInputMeal = {
  name: "",
  protain: 0,
  fat: 0,
  carbo: 0,
};

const Home: NextPage = () => {
  const [inputMeal, setInputMeal] = useState(initialInputMeal);
  const [mealList, setMealList] = useState<MealList>();

  useEffect(() => {
    const currentArray = localStorage.getItem(KEY);
    if (currentArray) {
      setMealList(JSON.parse(currentArray));
    }
  }, []);

  const KEY = "mealList";

  const onClickAddItem = () => {
    const prevArray = localStorage.getItem(KEY);
    let prev: MealList = [];
    if (prevArray !== null) {
      prev = [...JSON.parse(prevArray)];
    }

    localStorage.setItem(
      KEY,
      JSON.stringify([
        ...prev,
        {
          title: inputMeal.name,
          pfcList: [
            {
              title: "タンパク質",
              grams: inputMeal.protain,
            },
            {
              title: "脂質",
              grams: inputMeal.fat,
            },
            {
              title: "炭水化物（糖質）",
              grams: inputMeal.carbo,
            },
          ],
        },
      ])
    );

    setInputMeal(initialInputMeal);

    const currentArray = localStorage.getItem(KEY);
    if (currentArray) {
      setMealList(JSON.parse(currentArray));
    }
  };

  const onClickRemoveItem = (index: number) => {
    const removeArray = JSON.parse(localStorage.getItem(KEY)!).filter(
      (item, i: number) => i !== index
    );
    localStorage.setItem(KEY, JSON.stringify(removeArray));

    const currentArray = localStorage.getItem(KEY);
    if (currentArray) {
      setMealList(JSON.parse(currentArray));
    }
  };

  const onClickRemoveAllItem = () => {
    localStorage.removeItem(KEY);
    setMealList(undefined);
  };

  return (
    <div className="grid h-full grid-rows-[max-content_1fr_max-content]">
      <Head>
        <title>PFCバランス計算</title>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,maximum-scale=1.0"
        />
      </Head>

      <header className="bg-gray-100 p-4">
        <div className="grid grid-cols-[1fr_max-content]">
          {inputList.map((inputItem, i) => (
            <React.Fragment key={i}>
              <Text size="md">{inputItem}</Text>
              <Text className="text-right" size="md">
                {mealList &&
                  mealList
                    .map((mealItem, i) =>
                      mealItem.pfcList.find(
                        (pfcItem) => pfcItem.title === inputItem
                      )
                    )
                    .reduce((prev, current) => prev + current?.grams, 0)}
                g
              </Text>
            </React.Fragment>
          ))}
          <Text size="md">総摂取カロリー</Text>
          <Text size="md">
            {mealList &&
              mealList
                .map((mealItem) =>
                  mealItem.pfcList
                    .map((pfcItem) => {
                      switch (pfcItem.title) {
                        case "タンパク質":
                          return pfcItem.grams * 4;
                        case "脂質":
                          return pfcItem.grams * 9;
                        case "炭水化物（糖質）":
                          return pfcItem.grams * 4;
                        default:
                          return 0;
                      }
                    })
                    .reduce((prev, current) => {
                      return prev + current;
                    }, 0)
                )
                .reduce((prev, current) => {
                  return prev + current;
                }, 0)}
            kcal
          </Text>
        </div>
      </header>

      <ul className="m-0 grid content-start overflow-y-scroll px-4">
        {mealList &&
          mealList.map((mealItem, i) => (
            <li
              className="grid border-t border-gray-300 py-2 first:border-none"
              key={i}
            >
              <div className="grid grid-cols-[1fr_max-content]">
                <Text size="md" weight={700}>
                  {mealItem.title}
                </Text>
                <Button
                  variant="outline"
                  color="red"
                  compact
                  onClick={() => onClickRemoveItem(i)}
                >
                  削除
                </Button>
              </div>
              <div className="grid grid-cols-[1fr_max-content]">
                {mealItem.pfcList.map((pfcItem, i) => (
                  <React.Fragment key={i}>
                    <Text size="sm"> {pfcItem.title}</Text>
                    <Text className="text-right" size="sm">
                      {pfcItem.grams} g
                    </Text>
                  </React.Fragment>
                ))}
                <Text size="sm">合計kcal</Text>
                <Text size="sm">
                  {mealItem.pfcList
                    .map((pfcItem) => {
                      switch (pfcItem.title) {
                        case "タンパク質":
                          return pfcItem.grams * 4;
                        case "脂質":
                          return pfcItem.grams * 9;
                        case "炭水化物（糖質）":
                          return pfcItem.grams * 4;
                        default:
                          return pfcItem.grams;
                      }
                    })
                    .reduce((prev, current) => {
                      return prev + current;
                    }, 0)}
                  kcal
                </Text>
              </div>
            </li>
          ))}
      </ul>

      <footer className="grid gap-2 bg-gray-100 p-4">
        <div className="grid grid-cols-[max-content_1fr] items-center justify-start gap-2">
          <Input
            value={inputMeal?.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputMeal((prev) => {
                return {
                  ...prev,
                  name: e.target.value,
                };
              })
            }
            placeholder="品名"
            className="col-span-2"
          />

          <Text size="xs">タンパク質</Text>
          <NumberInput
            value={inputMeal.protain}
            onChange={(e: number) =>
              setInputMeal((prev) => {
                return {
                  ...prev,
                  protain: Number(e),
                };
              })
            }
            hideControls
            precision={2}
          />

          <Text size="xs">脂質</Text>
          <NumberInput
            value={inputMeal.fat}
            onChange={(e: number) =>
              setInputMeal((prev) => {
                return {
                  ...prev,
                  fat: Number(e),
                };
              })
            }
            hideControls
            precision={2}
          />

          <Text size="xs">炭水化物（糖質）</Text>
          <NumberInput
            value={inputMeal.carbo}
            onChange={(e: number) =>
              setInputMeal((prev) => {
                return {
                  ...prev,
                  carbo: Number(e),
                };
              })
            }
            hideControls
            precision={2}
          />

          <Button variant="outline" color="red" onClick={onClickRemoveAllItem}>
            すべて削除
          </Button>
          <Button
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            onClick={onClickAddItem}
          >
            追加
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Home;
