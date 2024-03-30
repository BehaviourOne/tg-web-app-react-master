import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";

const products = [
    {id: '1', title: 'Пицца Пепперони', price: 389, description: 'Колбаса Пепперони, Моцарелла'},
    {id: '2', title: 'Пицца Моцарелла', price: 419, description: 'Сыр Моцарелла, сыр Пармезан'},
    {id: '3', title: 'Пицца Жульен', price: 479, description: 'Куриное филе, шампиньоны, Пармезан'},
    {id: '4', title: 'Бургер Чили', price: 449, description: 'Говяжья котлета, перец Чили'},
    {id: '5', title: 'Блэк бургер', price: 5000, description: 'Котлеты Говяжья и Куриная, чёрная булка'},
    {id: '6', title: 'Бургер Загидовский', price: 999, description: 'Всё и сразу'},
    {id: '7', title: 'Компот', price: 79, description: 'Натуральный компот из кураги'},
    {id: '8', title: 'Содовая', price: 89, description: 'На ваш выбор фанта, спрайт, кола'},
]

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://192.168.0.44:8000/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [addedItems])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;
