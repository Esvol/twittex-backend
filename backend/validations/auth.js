import { body } from "express-validator";

export const registerValidator = [
    body('fullName', 'Имя должно быть от 2 до 20 символов').exists().isString().isLength({min: 2, max: 20}),
    body('email', 'Почта введена неверно!').exists().isEmail(),
    body('password', 'Пароль должен содержать миниммум 4 символа!').isString().exists().isLength({min: 4}),
    body('avatarURL', 'Неверная ссылка на изображение!').optional().isURL(),
]

export const loginValidator = [
    body('email', 'Почта введена неверно!').exists().isEmail(),
    body('password', 'Пароль должен содержать миниммум 4 символа!').exists().isString().isLength({min: 4}),
]

export const postCreateValidator = [
    body('title', 'Заголовок должен быть от 3 до 20 символов').exists().isLength({min: 3, max: 20}),
    body('text', 'Текст должен быть от 10 символов!').exists().isString().isLength({min: 10}),
    body('tags', 'Неверный формат тэга (должен быть указан массив)!').optional().isArray(),
    body('imageURL', 'Неверная ссылка на изображение!').optional().isURL(),
]

export const commentCreateValidator = [
    body('text', 'Текст должен содержать миниммум 1 символ!').exists().isString().isLength({min: 1}),
]