# Uwc6HaMGhudS6jyf355f6Bv496Z8wZg5VCn2fSgU

import cohere
from cohere.responses.classify import Example

co = cohere.Client('Uwc6HaMGhudS6jyf355f6Bv496Z8wZg5VCn2fSgU')

examples=[
  Example("操你妈", "Toxic"),
  Example("滚你妈的", "Toxic"),
  Example("他妈的", "Toxic"),
  Example("傻逼玩意", "Toxic"),
  Example("你妈死了", "Toxic"),
  Example("你没妈妈是吧", "Toxic"),
  Example("死妈东西", "Toxic"),
  Example("你好吗", "Benign"),
  Example("刚刚干啥了", "Benign"),
  Example("再来一次", "Benign"),
  Example("我的妈妈很好", "Benign"),
  Example("他身体很健康", "Benign"),
  Example("That is an interesting point", "Benign"),
  Example("I love this", "Benign"),
  Example("We should try that sometime", "Benign"),
  Example("You should go for it", "Benign"),
]
inputs=[
 "fuck!"
]

response = co.classify(
  inputs=inputs,
  examples=examples,
)
print(response)