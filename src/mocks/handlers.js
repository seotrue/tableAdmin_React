import {http, HttpResponse} from 'msw'
import order from "./dummy.json";
export const handlers = [
    http.get(`/order`,  ({ request, params, cookies }) => {
        return HttpResponse.json(order);
    }),

    http.post(`/order`,   async ({request}) => {
        const data = await request.json();
        let body = {
            data: data,
            message: '등록이 완료 되었습니다'
        }
        return HttpResponse.json(body, {status:200})
    }),

    http.delete(`/order`,   async ({request,params}) => {
        const data = await request.json();

        console.log(params,'datadatadatadatadata')
    }),
]