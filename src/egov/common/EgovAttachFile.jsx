import React from 'react';

import * as EgovNet from 'context/egovFetch';
import { SERVER_URL } from 'context/config';
import CODE from 'context/code';

import debug from 'debug';
const log = debug('egov:EgovAttachFile');

const EgovAttachFile = ({ boardFiles, mode, fnChangeFile, fnDeleteFile }) => {
  const onClickDownFile = (atchFileId, fileSn) => {
    window.open(
      SERVER_URL + '/cmm/fms/FileDown.do?atchFileId=' + atchFileId + '&fileSn=' + fileSn + '',
    );
  };

  const onClickDeleteFile = (atchFileId, fileSn, fileIndex) => {
    log('onClickDeleteFile Params:', atchFileId, fileSn, fileIndex);

    const formData = new FormData();
    formData.set('atchFileId', atchFileId);
    formData.set('fileSn', fileSn);

    const requestOptions = {
      method: 'POST',
      headers: {
        //'Content-type': 'multipart/form-data'
      },
      body: formData,
    };
    EgovNet.requestFetch('/cmm/fms/deleteFileInfsAPI.do', requestOptions, (response) => {
      log('board file delete', response);
      if (Number(response.resultCode) === Number(CODE.RCV_SUCCESS)) {
        // 성공
        log('deleted fileIndex', fileIndex);
        const _deleteFile = boardFiles.splice(fileIndex, 1);
        const _boardFiles = Object.assign([], boardFiles);
        fnDeleteFile(_boardFiles);
        alert('첨부파일이 삭제되었습니다.');
        fnChangeFile({});
      } else {
        alert('ERR : ' + response.resultMessage);
      }
    });
  };

  const onChangeFileInput = (e) => {
    log('onChangeFileInput e', e.target.files[0]);
    fnChangeFile(e.target.files[0]);
  };

  let filesTag = [];

  if (boardFiles !== undefined) {
    boardFiles.forEach((item, index) => {
      filesTag.push(
        <>
          <span>
            <a
              key={index}
              href={'#LINK'}
              onClick={(e) => {
                e.preventDefault();
                onClickDownFile(item.atchFileId, item.fileSn);
              }}
              download>
              {item.orignlFileNm}
            </a>
            <span>[{item.fileMg}byte]</span>
          </span>
        </>,
      );

      if (mode === CODE.MODE_MODIFY) {
        filesTag.push(
          <>
            <button
              className="btn btn_delete"
              onClick={(e) => {
                onClickDeleteFile(item.atchFileId, item.fileSn, index);
              }}></button>
          </>,
        );
      }
      filesTag.push(<br />);
    });
  }

  log('filesTag:', filesTag);

  return (
    <dl>
      <dt>첨부파일</dt>
      <dd>
        <span className="file_attach">
          {filesTag}
          {(mode === CODE.MODE_MODIFY || mode === CODE.MODE_CREATE) && (
            <input
              name="file_0"
              id="egovComFileUploader"
              type="file"
              onChange={(e) => onChangeFileInput(e)}></input>
          )}
        </span>
      </dd>
    </dl>
  );
};

export default React.memo(EgovAttachFile);
