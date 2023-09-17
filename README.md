
# Real-time clothes segmentation with TF.JS


Real-time implementation of the [SegFormer](https://github.com/NVlabs/SegFormer) model fine-tuned on [ATR dataset](https://huggingface.co/datasets/mattmdjaga/human_parsing_dataset) for clothes segmentation


SegFormer is a simple, efficient yet powerful semantic segmentation framework which unifies Transformers with lightweight multilayer perception (MLP) decoders. [[Paper]](https://arxiv.org/abs/2105.15203)


The model recognizes 17 [different classes](https://github.com/hugozanini/segformer-clothes-tfjs/blob/40ae6842ffc404df3b059ecc36e3c420fe327ebf/src/App.jsx#L32) and just need a webpage to run.


<!-- <body> 
<img  alt="Qries"
src="https://github.com/hugozanini/yolov7-tfjs/blob/master/git-media/yolov7-tfjs-optimized.gif?raw=true"  width="400">
</body



<body> <a href="https://codesandbox.io/p/github/hugozanini/yolov7-tfjs/master?file=%2FREADME.md">
<img  alt="Qries"
src="https://raw.githubusercontent.com/hugozanini/realtime-sku-detection/main/git-media/sandbox.png"  height="100">
</a>
</body
<br> -->




## Citation

```bibtex
@article{DBLP:journals/corr/abs-2105-15203,
  author    = {Enze Xie and
               Wenhai Wang and
               Zhiding Yu and
               Anima Anandkumar and
               Jose M. Alvarez and
               Ping Luo},
  title     = {SegFormer: Simple and Efficient Design for Semantic Segmentation with
               Transformers},
  journal   = {CoRR},
  volume    = {abs/2105.15203},
  year      = {2021},
  url       = {https://arxiv.org/abs/2105.15203},
  eprinttype = {arXiv},
  eprint    = {2105.15203},
  timestamp = {Wed, 02 Jun 2021 11:46:42 +0200},
  biburl    = {https://dblp.org/rec/journals/corr/abs-2105-15203.bib},
  bibsource = {dblp computer science bibliography, https://dblp.org}
}
``` 

## Acknowledgment

<img align="left" width="200" height="183" src="https://raw.githubusercontent.com/hugozanini/yolov7-tfjs/organizing-repo/git-media/Experts_Stickers_05.gif">This code was developed under the financial assistance of the [Google Developers Group](https://developers.google.com/community/gdg),  which provided all the computational resources for training and converting the models.

<br> 
