/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */

import { default as TestApi } from "./TestApi";
import * as Sinon from "sinon";
import { SinonFakeServer } from "sinon";
import { assert } from "chai";

class FormData {
  append(): void {}
}

declare let global: any;
global.XMLHttpRequest = Sinon.useFakeXMLHttpRequest();
global.FormData = FormData;

describe("Revival", () => {
  let server: SinonFakeServer;

  before(function() {
    server = Sinon.fakeServer.create();
  });

  after(function() {
    server.restore();
  });

  it("Get", () => {
    server.respondWith(
      "GET",
      "http://test.com/test/get?test1=2&test2=yes&string=1111",
      [200, { "Content-Type": "application/json" }, `{ "id": 123 }`]
    );
    TestApi.testGet("testHeader", "1111", { test1: 2, test2: "yes" }).enqueue(
      r => console.log("Result", r),
      e => console.log(e)
    );
  });
  it("Post", () => {
    server.respondWith("POST", "http://test.com/test/post", [
      200,
      { "Content-Type": "application/json", header2: 23 },
      `{ "id": 12, "name": "Revival" }`
    ]);
    TestApi.testPost({ kit: 11 }).subscribe(
      s => {
        assert.deepEqual(s, { id: 12, name: "Revival" });
      },
      e => console.log("error: ", e)
    );
  });
  it("MultiPart", () => {
    server.respondWith("POST", "http://test.com/test/multipart", [
      200,
      { "Content-Type": "application/json" },
      `{ "id": 12 }`
    ]);
    TestApi.testMultiPart("This is description.")
      .then(r => assert.deepEqual(r, { id: 12 }))
      .catch(e => console.log(e));
  });
  it("FormUrlEncoded", () => {
    TestApi.testUrlFormEncode(22);
  });
  it("Headers", () => {
    TestApi.testHeaders();
  });
});