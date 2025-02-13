import { APIGetRequest } from '/modules/request.mjs';

function test() {
  APIGetRequest(`user/${'d3e6fd80-c903-4f0a-87e8-b607f85252c5'}/reports`)
    .catch((e) => {
      console.log(e);
    })
    .then((res) => {
      console.log(res);
    });
}

window.test = test;
