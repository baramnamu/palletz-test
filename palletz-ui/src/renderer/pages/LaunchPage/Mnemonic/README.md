# Mnemonic Context

## VerifyContext

```typescript
type IVerifyContext = {
  verifyStep: number,
  currentStep: number,
  sequence: 'new' | 'replication' | 'restoration'
  code: string
}
```
* ``verifyStep``: 현재까지 백업된 니모닉
* ``currentStep``: 니모닉 백업 순서 --> (버튼을 그리는 컴포넌트)
    * ``0``: MnemonicCard: 현재 니모닉에 관한 정보 --> ``Check`` Btn
    * ``1``: MnemonicShow: showStep의 니모닉을 보여줌 --> ``Check`` Btn
    * ``2``: MnemonicVerify: 이전에 보여준 니모닉을 입력받고 검증 --> ``Table`` Btn (ref)
    * ``3``: MnemonicCard: 2에서 showStep이 totalCount와 일치하면 넘어옴 --> ``Check`` Btn
* ``sequence``: 니모닉 백업의 종류
* ``code``: 니모닉의 4바이트 Verification code
