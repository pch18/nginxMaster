import NiceModal, { useModal } from "@ebay/nice-modal-react";

export interface NiceModalInjection<Return = undefined> {
  props: {
    visible: boolean;
    afterClose: () => void;
    onCancel: () => void;
  };
  resolve: Return extends undefined ? () => void : (r: Return) => void;
  reject: (e?: Error) => void;
}

export const createNiceModal = <Props extends Record<string, unknown>, Return>(
  Comp: React.ComponentType<Props & { _modal: NiceModalInjection<Return> }>
) => {
  const CompWrapper: React.FC<Props> = (props) => {
    const modal = useModal();
    const _modal: NiceModalInjection<Return> = {
      props: {
        visible: modal.visible,
        afterClose: modal.remove,
        onCancel: () => {
          modal.reject();
          void modal.hide();
        },
      },
      resolve: ((r: Return) => {
        modal.resolve(r);
        void modal.hide();
      }) as any,
      reject: (e?: Error) => {
        modal.reject(e);
        void modal.hide();
      },
    };
    return <Comp {...props} _modal={_modal} />;
  };
  const Modal = NiceModal.create(CompWrapper);
  return async (props: Props): Promise<Return> => {
    return await NiceModal.show(Modal, props as any);
  };
};
