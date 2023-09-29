import { OPermissions } from '../types/o-permissions.type';
import { Util } from './util';

export class PermissionsUtils {
  public static ACTION_REFRESH = 'refresh';
  public static ACTION_INSERT = 'insert';
  public static ACTION_UPDATE = 'update';
  public static ACTION_DELETE = 'delete';

  public static STANDARD_ACTIONS = [
    PermissionsUtils.ACTION_REFRESH,
    PermissionsUtils.ACTION_INSERT,
    PermissionsUtils.ACTION_UPDATE,
    PermissionsUtils.ACTION_DELETE
  ];

  static checkEnabledPermission(permission: OPermissions): boolean {
    if (Util.isDefined(permission) && permission.enabled === false) {
      console.warn('MESSAGES.OPERATION_NOT_ALLOWED_PERMISSION');
      return false;
    }
    return true;
  }

  static registerDisabledChangesInDom(nativeElement: any, args?: any): MutationObserver {
    const callback: Function = args && args.callback ? args.callback : PermissionsUtils.setDisabledDOMElement;
    const checkStringValue: boolean = !!(args && args.checkStringValue);
    if (!Util.isDefined(nativeElement)) {
      return undefined;
    }

    const mutationObserver = new MutationObserver((mutations: MutationRecord[]) => {
      const mutation = mutations[0];
      if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
        const attribute = (mutation.target as any).attributes.getNamedItem('disabled');
        if (attribute === null || (checkStringValue && attribute.value !== 'true')) {
          callback(mutation);
        }
      }
    });

    mutationObserver.observe(nativeElement, {
      attributes: true,
      attributeFilter: ['disabled']
    });

    return mutationObserver;
  }

  static setDisabledDOMElement(mutation: MutationRecord) {
    const element = <HTMLInputElement>mutation.target;
    element.setAttribute('disabled', 'true');
  }
}
