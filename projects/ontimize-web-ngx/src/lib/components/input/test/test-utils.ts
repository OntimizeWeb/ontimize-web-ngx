import { Config } from "../../../types/config.type";

export class TestUtils {

  static mockConfiguration(): Config {
    return {
      uuid: 'com.ontimize.web.test',
      title: 'Ontimize Web Testing',
      locale: 'en'
    }
  }
}