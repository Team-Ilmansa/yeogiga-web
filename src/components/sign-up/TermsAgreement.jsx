import { useState } from 'react'

/** 이용 약관 동의 화면 */
const TermsAgreement = ({ isAgreed, onChangeAgree }) => {
  const [internalAgreed, setInternalAgreed] = useState(false)

  const isControlled = typeof isAgreed === 'boolean'
  const checked = isControlled ? isAgreed : internalAgreed

  const handleChange = (e) => {
    const next = e.target.checked

    if (!isControlled) {
      setInternalAgreed(next)
    }

    if (onChangeAgree) {
      onChangeAgree(next)
    }
  }
  return (
    <div className='px-10'>
      {/* 상단 안내 문구 */}
      <div className='mb-10'>
        <div className='text-4xl/[1.4] font-bold text-[var(--Grey-Scale-grey-400)]'>
          서비스 이용약관에
          <br />
          동의해주세요
        </div>
        <div className='mt-3 text-lg/[2] text-[var(--Grey-Scale-grey-300)]'>
          정확한 데이터 조회와 더 원활한 서비스 이용을 위해 꼭 필요해요
        </div>
      </div>

      <div className='flex w-full justify-center'>
        <div className='w-full max-w-[640px]'>
          {/* 약관 내용 박스 */}
          <div className='h-[360px] w-full overflow-y-auto rounded-2xl border border-[var(--Grey-Scale-grey-100)] bg-[var(--Grey-Scale-grey-50)] px-6 py-5 text-sm leading-relaxed text-[var(--Grey-Scale-grey-400)]'>
            <div className='space-y-4'>
              <h1 className='text-base font-bold text-[var(--Grey-Scale-grey-500)]'>
                일로만난사이 서비스 이용약관
              </h1>

              <section>
                <h2 className='font-semibold'>제1조 (목적)</h2>
                <p>
                  이 약관은 일로만난사이(이하 &quot;회사&quot;라 함)이 제공하는
                  서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및
                  책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>
              </section>

              <section>
                <h2 className='font-semibold'>제2조 (정의)</h2>
                <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
                <ol className='ml-4 list-decimal space-y-1'>
                  <li>
                    &quot;서비스&quot;란 회사가 제공하는 모든 서비스를
                    의미합니다.
                  </li>
                  <li>
                    &quot;이용자&quot;란 이 약관에 따라 회사가 제공하는 서비스를
                    이용하는 회원 및 비회원을 말합니다.
                  </li>
                  <li>
                    &quot;회원&quot;이란 회사에 개인정보를 제공하여 회원등록을
                    한 자로서, 회사의 정보를 지속적으로 제공받으며 회사가
                    제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
                  </li>
                  <li>
                    &quot;비회원&quot;이란 회원에 가입하지 않고 회사가 제공하는
                    서비스를 이용하는 자를 말합니다.
                  </li>
                  <li>
                    &quot;콘텐츠&quot;란 회사 또는 이용자가 서비스 상에 게시한
                    모든 글, 사진, 동영상, 첨부파일, 링크 등을 말합니다.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className='font-semibold'>제3조 (약관 외 준칙)</h2>
                <p>
                  이 약관에서 정하지 아니한 사항은 전기통신사업법, 전자상거래
                  등에서의 소비자보호에 관한 법률, 개인정보 보호법 등 관련
                  법령의 규정과 일반적인 상관례에 의합니다.
                </p>
              </section>

              <section>
                <h2 className='font-semibold'>제4조 (약관의 효력과 변경)</h2>
                <ol className='ml-4 list-decimal space-y-1'>
                  <li>
                    이 약관은 서비스를 이용하고자 하는 모든 이용자에게
                    적용됩니다.
                  </li>
                  <li>
                    회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이
                    약관을 변경할 수 있습니다.
                  </li>
                  <li>
                    회사가 약관을 변경할 경우에는 적용일자 및 변경사유를
                    명시하여 현행 약관과 함께 서비스 내 공지사항에 그 적용일자
                    7일 전부터 적용일자 전일까지 공지합니다. 다만, 이용자에게
                    불리한 약관의 변경의 경우에는 30일 전부터 공지합니다.
                  </li>
                  <li>
                    이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을
                    중단하고 회원 탈퇴를 요청할 수 있습니다. 변경된 약관의 효력
                    발생일 이후에도 서비스를 계속 이용할 경우 약관의 변경사항에
                    동의한 것으로 간주됩니다.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className='font-semibold'>제5조 (이용계약의 체결)</h2>
                <ol className='ml-4 list-decimal space-y-1'>
                  <li>
                    이용계약은 이용자가 이 약관에 동의하고 회사가 정한 가입
                    양식에 따라 회원정보를 기입한 후 가입을 신청하고, 회사가
                    이를 승낙함으로써 체결됩니다.
                  </li>
                  <li>
                    회사는 다음 각 호에 해당하는 신청에 대해서는 승낙을 하지
                    않거나 사후에 이용계약을 해지할 수 있습니다. 회사는 이용신청
                    요건을 충족하는 모든 이용자의 신청을 승낙합니다.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className='font-semibold'>제6조 (회원정보의 변경)</h2>
                <ol className='ml-4 list-decimal space-y-1'>
                  <li>
                    회원은 개인정보 관리화면을 통하여 언제든지 본인의 개인정보를
                    열람하고 수정할 수 있습니다.
                  </li>
                  <li>
                    회원은 회원가입 시 기재한 사항이 변경되었을 경우 온라인으로
                    수정을 하거나 전자우편 또는 기타 방법으로 회사에 그
                    변경사항을 알려야 합니다.
                  </li>
                  <li>
                    제2항의 변경사항을 회사에 알리지 않아 발생한 불이익에 대하여
                    회사는 책임을 지지 않습니다.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className='font-semibold'>제7조 (개인정보보호 의무)</h2>
                <p>
                  회사는 관련 법령이 정하는 바에 따라 회원의 개인정보를 보호하기
                  위해 노력합니다. 개인정보의 보호 및 사용에 대해서는 관련 법령
                  및 회사의 개인정보처리방침이 적용됩니다.
                </p>
              </section>

              <section>
                <h2 className='font-semibold'>
                  제8조 (회원의 아이디 및 비밀번호의 관리에 대한 의무)
                </h2>
                <ol className='ml-4 list-decimal space-y-1'>
                  <li>
                    회원의 아이디와 비밀번호에 관한 관리책임은 회원에게 있으며,
                    이를 제3자가 이용하도록 하여서는 안 됩니다.
                  </li>
                  <li>
                    회사는 회원의 아이디가 개인정보 유출 우려가 있거나, 반사회적
                    또는 미풍양속에 어긋나거나 회사 및 회사의 운영자로 오인할
                    우려가 있는 경우, 해당 아이디의 이용을 제한할 수 있습니다.
                  </li>
                  <li>
                    회원은 아이디 및 비밀번호가 도용되거나 제3자가 사용하고
                    있음을 인지한 경우에는 이를 즉시 회사에 통지하고 회사의
                    안내에 따라야 합니다.
                  </li>
                  <li>
                    제3항의 경우에 해당 회원이 회사에 그 사실을 통지하지 않거나,
                    통지한 경우에도 회사의 안내에 따르지 않아 발생한 불이익에
                    대하여 회사는 책임을 지지 않습니다.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className='font-semibold'>제9조 (이용자의 의무)</h2>
                <ol className='ml-4 list-decimal space-y-1'>
                  <li>
                    이용자는 다음 행위를 하여서는 안 됩니다.
                    <ol className='ml-4 list-decimal space-y-1'>
                      <li>신청 또는 변경 시 허위 내용의 등록</li>
                      <li>타인의 정보 도용</li>
                      <li>회사가 게시한 정보의 변경</li>
                      <li>
                        회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의
                        송신 또는 게시
                      </li>
                      <li>
                        회사와 기타 제3자의 저작권 등 지식재산권에 대한 침해
                      </li>
                      <li>
                        회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는
                        행위
                      </li>
                      <li>
                        외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에
                        반하는 정보를 서비스에 공개 또는 게시하는 행위
                      </li>
                      <li>기타 불법적이거나 부당한 행위</li>
                    </ol>
                  </li>
                  <li>
                    이용자는 관계법령, 이 약관의 규정, 이용안내 및 서비스와
                    관련하여 공지한 주의사항, 회사가 통지하는 사항 등을
                    준수하여야 하며, 기타 회사의 업무에 방해되는 행위를 하여서는
                    안 됩니다.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className='font-semibold'>
                  제10조 (서비스의 제공 및 변경)
                </h2>
                <ol className='ml-4 list-decimal space-y-1'>
                  <li>
                    회사는 다음과 같은 서비스를 제공합니다. GPS 기반 사진 매핑,
                    가계부, 지도 제공 등
                  </li>
                  <li>
                    회사는 상당한 이유가 있는 경우에 운영상, 기술상의 필요에
                    따라 제공하고 있는 서비스를 변경할 수 있습니다.
                  </li>
                  <li>
                    회사는 이용자에게 서비스를 제공함에 있어 관련 법령, 약관,
                    운영정책 및 공지사항 등에서 정한 바에 따라 무료로 서비스를
                    제공합니다.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className='font-semibold'>제11조 (서비스의 중단)</h2>
                <ol className='ml-4 list-decimal space-y-1'>
                  <li>
                    회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장,
                    통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을
                    일시적으로 중단할 수 있습니다.
                  </li>
                  <li>
                    회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로
                    인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다.
                    단, 회사가 고의 또는 과실이 없음을 입증하는 경우에는
                    그러하지 아니합니다.
                  </li>
                  <li>
                    사업종목의 전환, 사업의 포기, 업체 간의 통합 등의 이유로
                    서비스를 제공할 수 없게 되는 경우에는 회사는 제4조에 정한
                    방법으로 이용자에게 통지하고 당초 회사에서 제시한 조건에
                    따라 소비자에게 보상합니다.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className='font-semibold'>
                  제12조 (회원탈퇴 및 자격 상실 등)
                </h2>
                <ol className='ml-4 list-decimal space-y-1'>
                  <li>
                    회원은 회사에 언제든지 탈퇴를 요청할 수 있으며 회사는 즉시
                    회원탈퇴를 처리합니다.
                  </li>
                  <li>
                    회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을
                    제한 및 정지시킬 수 있습니다.
                    <ol className='ml-4 list-decimal space-y-1'>
                      <li>가입 신청 시에 허위 내용을 등록한 경우</li>
                      <li>
                        다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는
                        등 전자상거래 질서를 위협하는 경우
                      </li>
                      <li>
                        서비스를 이용하여 법령 또는 이 약관이 금지하거나
                        공서양속에 반하는 행위를 하는 경우
                      </li>
                    </ol>
                  </li>
                  <li>
                    회사가 회원 자격을 제한·정지시킨 후, 동일한 행위가 2회 이상
                    반복되거나 30일 이내에 그 사유가 시정되지 아니하는 경우
                    회사는 회원자격을 상실시킬 수 있습니다.
                  </li>
                  <li>
                    회사가 회원자격을 상실시키는 경우에는 회원등록을 말소합니다.
                    이 경우 회원에게 이를 통지하고, 회원등록 말소 전에 최소한
                    30일 이상의 기간을 정하여 소명할 기회를 부여합니다.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className='font-semibold'>
                  제13조 (정보의 제공 및 광고의 게재)
                </h2>
                <p>
                  회사는 회원에게 서비스 이용에 필요한 정보를 공지사항이나
                  전자우편 등의 방법으로 제공할 수 있습니다. 다만, 회사는 회원이
                  동의하지 않는 한 영리목적의 광고성 정보를 제공하지 않습니다.
                </p>
              </section>

              <section>
                <h2 className='font-semibold'>제14조 (서비스 이용시간)</h2>
                <ol className='ml-4 list-decimal space-y-1'>
                  <li>
                    서비스 이용은 회사의 업무상 또는 기술상 특별한 지장이 없는
                    한 연중무휴, 1일 24시간 운영을 원칙으로 합니다.
                  </li>
                  <li>
                    회사는 서비스를 일정범위로 분할하여 각 범위별로 이용가능
                    시간을 별도로 정할 수 있습니다. 이 경우 그 내용을 사전에
                    공지합니다.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className='font-semibold'>제15조 (서비스 이용 제한)</h2>
                <ol className='ml-4 list-decimal space-y-1'>
                  <li>
                    회사는 전시, 사변, 천재지변 또는 이에 준하는 국가비상사태가
                    발생하거나 발생할 우려가 있는 경우와 전기통신사업법에 의한
                    기간통신사업자가 전기통신 서비스를 중지하는 등 기타
                    불가항력적 사유가 있는 경우에는 서비스의 전부 또는 일부를
                    제한하거나 중지할 수 있습니다.
                  </li>
                  <li>
                    회사는 제1항에 의한 서비스 중단의 경우에는 상당한 기간 내에
                    그 사유를 공지하고, 사전에 공지할 수 없는 부득이한 사유가
                    있는 경우에는 사후에 공지합니다.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className='font-semibold'>제16조 (책임제한)</h2>
                <ol className='ml-4 list-decimal space-y-1'>
                  <li>
                    회사는 천재지변 또는 이에 준하는 불가항력으로 인하여
                    서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이
                    면제됩니다.
                  </li>
                  <li>
                    회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는
                    책임을 지지 않습니다.
                  </li>
                  <li>
                    회사는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에
                    대하여 책임을 지지 않으며, 그 밖의 서비스를 통하여 얻은
                    자료로 인한 손해에 관하여 책임을 지지 않습니다.
                  </li>
                  <li>
                    회사는 회원이 게재한 정보, 자료, 사실의 신뢰도, 정확성 등
                    내용에 관하여는 책임을 지지 않습니다.
                  </li>
                  <li>
                    회사는 회원 간 또는 회원과 제3자 상호간에 서비스를 매개로
                    하여 거래 등을 한 경우에는 책임이 면제됩니다.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className='font-semibold'>제17조 (준거법 및 재판관할)</h2>
                <ol className='ml-4 list-decimal space-y-1'>
                  <li>
                    회사와 회원 간 제기된 소송은 대한민국법을 준거법으로 합니다.
                  </li>
                  <li>
                    회사와 회원 간 발생한 분쟁에 관한 소송은 회사 소재지
                    관할법원의 관할로 합니다.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className='font-semibold'>제18조 (기타)</h2>
                <ol className='ml-4 list-decimal space-y-1'>
                  <li>
                    이 약관에 명시되지 않은 사항은 관련 법령의 규정에 따릅니다.
                  </li>
                  <li>
                    회사는 필요한 경우 특정 서비스에 관하여 별도의 이용약관 및
                    정책을 둘 수 있으며, 해당 내용이 이 약관과 상충할 경우에는
                    별도의 이용약관 및 정책이 우선하여 적용됩니다.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className='font-semibold'>부칙</h2>
                <p>이 약관은 20XX-XX-XX부터 시행합니다.</p>
              </section>
            </div>
          </div>

          <div className='mt-4 flex w-full items-center justify-between'>
            <span className='text-sm text-[var(--Grey-Scale-grey-300)]'>
              상기 내용에 동의합니다.
            </span>

            <input
              type='checkbox'
              checked={checked}
              onChange={handleChange}
              className='h-4 w-4 cursor-pointer accent-[#8287FF]'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsAgreement
